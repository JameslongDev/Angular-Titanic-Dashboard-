import { Injectable } from '@angular/core';

export interface ChartComment {
  id: number;
  chartId: string;
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  private allComments: ChartComment[] = [];
  
  private nextId = 1;

  constructor() { }

  getCommentsForChart(chartId: string): ChartComment[] {
    return this.allComments.filter(c => c.chartId === chartId);
  }

  addComment(chartId: string, text: string): void {
    const newComment: ChartComment = { 
      id: this.nextId++,
      chartId: chartId, 
      text: text 
    };

    this.allComments.push(newComment);
  }

  updateComment(commentId: number, newText: string): void {
    const commentToUpdate = this.allComments.find(c => c.id === commentId);

    if (commentToUpdate) {
      commentToUpdate.text = newText;
    }
  }


  deleteComment(commentId: number): void {
    this.allComments = this.allComments.filter(comment => comment.id !== commentId);
  }
}