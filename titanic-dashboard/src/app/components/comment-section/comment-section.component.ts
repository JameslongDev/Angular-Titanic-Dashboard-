import { Component, Input, OnInit } from '@angular/core';
import { ChartComment, CommentService } from '../../services/comment.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment-section',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss'],
})
export class CommentSectionComponent implements OnInit {
  @Input() chartId!: string;
  
  comments: ChartComment[] = [];
  newCommentText = '';
  editingCommentId: number | null = null;
  editingText = '';

  constructor(private commentService: CommentService) {}

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.comments = this.commentService.getCommentsForChart(this.chartId);
  }

  addComment(): void {
    if (this.newCommentText.trim()) {
      this.commentService.addComment(this.chartId, this.newCommentText.trim());
      this.newCommentText = '';
      this.loadComments();
    }
  }

  enableEditing(comment: ChartComment): void {
    this.editingCommentId = comment.id;
    this.editingText = comment.text;
  }

  saveEdit(commentId: number): void {
    if (this.editingText.trim()) {
      this.commentService.updateComment(commentId, this.editingText.trim());
      this.cancelEditing();
      this.loadComments(); 
    }
  }

  cancelEditing(): void {
    this.editingCommentId = null;
    this.editingText = '';
  }

  deleteComment(id: number): void {
    if (confirm('Are you sure you want to delete this comment?')) {
      this.commentService.deleteComment(id);
      this.loadComments();
    }
  }
}
