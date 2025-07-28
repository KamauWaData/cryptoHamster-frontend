import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Book, Edit, Trash, Star } from 'lucide-react';
import { format } from 'date-fns';
import { Article } from '@/integrations/types';

interface ArticleTableRowProps {
  article: Article;
  onEdit: (article: Article) => void;
  onDelete: (id: number) => void;
}

const ArticleTableRow: React.FC<ArticleTableRowProps> = ({
  article,
  onEdit,
  onDelete
}) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{article.title}</TableCell>
      <TableCell>{article.category}</TableCell>
      <TableCell>{article.author}</TableCell>
      <TableCell>{article.published_date ? format(new Date(article.published_date), 'MMM dd, yyyy') : 'N/A'}</TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {article.status}
        </span>
      </TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded text-xs font-medium ${
          article.is_auto_update ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {article.is_auto_update ? 'Enabled' : 'Disabled'}
        </span>
      </TableCell>
      <TableCell>
        <span className={`px-2 py-1 rounded text-xs font-medium flex items-center space-x-1 ${
          article.is_featured ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
        }`}>
          {article.is_featured && <Star className="h-3 w-3" />}
          <span>{article.is_featured ? 'Featured' : 'Regular'}</span>
        </span>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-2">
          <Collapsible>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm">
                <Book className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 border p-4 rounded-md bg-gray-50">
              <p className="text-sm">{article.excerpt}</p>
            </CollapsibleContent>
          </Collapsible>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onEdit(article)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(article.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default ArticleTableRow;