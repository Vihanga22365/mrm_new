from pydantic import BaseModel
from typing import Optional

class AnalyzeRequest(BaseModel):
    structure_content: Optional[str] = ""
    usecase_content: Optional[str] = ""

class GenerateRequest(BaseModel):
    chapter: str
    chapter_description: str
    instructions: str
    structure_content: str
    usecase_content: str

class ReviewRequest(BaseModel):
    document_content: str
    usecase_content: str
    technical_content: Optional[str] = None

class CommentReviewRequest(BaseModel):
    comment_text: str
    report_text: str # The context around the comment
    additional_instructions: Optional[str] = None # Extra guidance from the user
