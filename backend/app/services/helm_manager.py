import os
import tarfile
import hashlib
from datetime import datetime
from typing import List, Dict, Any
from ruamel.yaml import YAML
from ..core.config import settings

yaml = YAML()
yaml.preserve_quotes = True

class HelmManager:
    def __init__(self, storage_path: str = settings.STORAGE_PATH):
        self.storage_path = storage_path
        if not os.path.exists(self.storage_path):
            os.makedirs(self.storage_path)

    def get_chart_metadata(self, tgz_path: str) -> Dict[str, Any]:
        with tarfile.open(tgz_path, "r:gz") as tar:
            # Helm charts are usually in a subdirectory named after the chart
            # We look for Chart.yaml
            for member in tar.getmembers():
                if member.name.endswith("Chart.yaml"):
                    f = tar.extractfile(member)
                    return yaml.load(f)
        return {}

    def calculate_digest(self, file_path: str) -> str:
        sha256_hash = hashlib.sha256()
        with open(file_path, "rb") as f:
            for byte_block in iter(lambda: f.read(4096), b""):
                sha256_hash.update(byte_block)
        return sha256_hash.hexdigest()

    def generate_index(self):
        index_path = os.path.join(self.storage_path, "index.yaml")
        entries = {}

        for filename in os.listdir(self.storage_path):
            if filename.endswith(".tgz"):
                full_path = os.path.join(self.storage_path, filename)
                metadata = self.get_chart_metadata(full_path)
                if not metadata:
                    continue

                name = metadata.get("name")
                version = metadata.get("version")
                # use file modification time as created timestamp so newer uploads sort correctly
                created_ts = datetime.utcfromtimestamp(os.path.getmtime(full_path)).isoformat() + "Z"

                entry = {
                    "apiVersion": metadata.get("apiVersion", "v2"),
                    "appVersion": metadata.get("appVersion", ""),
                    "created": created_ts,
                    "description": metadata.get("description", ""),
                    "digest": self.calculate_digest(full_path),
                    "name": name,
                    "urls": [filename],
                    "version": version,
                }
                
                # Add optional fields
                for field in ["icon", "home", "sources", "maintainers", "keywords"]:
                    if field in metadata:
                        entry[field] = metadata[field]

                if name not in entries:
                    entries[name] = []
                entries[name].append(entry)

        # Sort versions for each chart so newest appears first.
        # Prefer semantic version comparison if packaging is available; otherwise sort by created timestamp.
        try:
            from packaging.version import Version, InvalidVersion  # type: ignore

            def sort_key(e):
                try:
                    return Version(e.get('version', '0'))
                except Exception:
                    # fallback to created timestamp string
                    return e.get('created', '')

        except Exception:
            def sort_key(e):
                return e.get('created', '')

        for name in entries:
            entries[name].sort(key=sort_key, reverse=True)

        index = {
            "apiVersion": "v1",
            "entries": entries,
            "generated": datetime.utcnow().isoformat() + "Z"
        }

        with open(index_path, "w") as f:
            yaml.dump(index, f)

helm_manager = HelmManager()
