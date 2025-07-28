import React, { SetStateAction } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import ArticleTableRow from './ArticleTableRow';
import { Article } from '@/integrations/types';

interface ArticleTableProps {
    articles: Article[]; // Ensure this is the full Article type
    isLoading: boolean; // Loading state
    //onArticleChange: (article: SetStateAction<Article>) => void; // Update type here
    //onSubmit: () => void;
    //onCancel: () => void;
    onEditArticle: (article: Article) => void; // Function to handle editing an article
    isEditing?: boolean;
    //title: string;
    //submitText: string;
  onDeleteArticle: (id: number) => void;
}

const ArticleTable: React.FC<ArticleTableProps> = ({
  articles,
  isLoading,
  onEditArticle,
  onDeleteArticle
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-trendforge-600" />
        <span className="ml-2">Loading articles...</span>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Auto-Update</TableHead>
          <TableHead>Featured</TableHead>
          <TableHead>Editor's Pick</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {articles.length === 0 ? (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
              No articles found. Add your first article!
            </TableCell>
          </TableRow>
        ) : (
          articles.map((article) => (
            <ArticleTableRow
              key={article.id}
              article={article}
              onEdit={onEditArticle}
              onDelete={onDeleteArticle}
            />
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default ArticleTable;