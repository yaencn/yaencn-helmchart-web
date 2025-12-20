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
                
                entry = {
                    "apiVersion": metadata.get("apiVersion", "v2"),
                    "appVersion": metadata.get("appVersion", ""),
                    "created": datetime.utcnow().isoformat() + "Z",
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

        index = {
            "apiVersion": "v1",
            "entries": entries,
            "generated": datetime.utcnow().isoformat() + "Z"
        }

        with open(index_path, "w") as f:
            yaml.dump(index, f)

helm_manager = HelmManager()
