from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from typing import List
import os
import shutil
from ..services.helm_manager import helm_manager
from ..core.config import settings
from .deps import get_current_active_superuser

router = APIRouter()

@router.post("/upload")
async def upload_chart(
    file: UploadFile = File(...),
    current_user = Depends(get_current_active_superuser)
):
    if not file.filename.endswith(".tgz"):
        raise HTTPException(status_code=400, detail="Only .tgz files are allowed")
    
    file_path = os.path.join(settings.STORAGE_PATH, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    try:
        helm_manager.generate_index()
    except Exception as e:
        os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to update index: {str(e)}")
    
    return {"message": f"Successfully uploaded {file.filename}"}

@router.delete("/{filename}")
async def delete_chart(
    filename: str,
    current_user = Depends(get_current_active_superuser)
):
    file_path = os.path.join(settings.STORAGE_PATH, filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Chart not found")
    
    os.remove(file_path)
    helm_manager.generate_index()
    return {"message": f"Successfully deleted {filename}"}

@router.get("/list")
async def list_charts():
    index_path = os.path.join(settings.STORAGE_PATH, "index.yaml")
    if not os.path.exists(index_path):
        return {"entries": {}}
    
    from ruamel.yaml import YAML
    yaml = YAML()
    with open(index_path, "r") as f:
        return yaml.load(f)
