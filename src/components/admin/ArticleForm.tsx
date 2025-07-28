import React from 'react';
import { useEffect, useState } from 'react';
import { apiClient } from '@/integrations/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Article } from '@/integrations/types';
import RichTextEditor from './RichTextEditor';
import { read } from 'fs';
import { User } from 'lucide-react';
import { set } from 'react-hook-form';

interface ArticleFormProps {
  article: Partial<Article>;
  onArticleChange: (article: Partial<Article>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  isEditing?: boolean;
  title: string;
  submitText: string;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  article,
  onArticleChange,
  onSubmit,
  onCancel,
  isEditing = false,
  title,
  submitText
}) => {
  const idPrefix = isEditing ? 'edit-' : '';
  const [userName, setUserName] = useState('');
  const [userImageUrl, setUserImageUrl] = useState('/default-author-image.jpg');

  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const response = await apiClient.get('accounts/users/me/', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        });
      if (response.data) {
        setUserName(response.data.name)
        setUserImageUrl(response.data.image_url || '/default-author-image.jpg');
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  fetchUserData();
}, []);

  return (
    <Card className="mb-4 sm:mb-6 lg:mb-8 mx-2 sm:mx-0">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-xl lg:text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 space-y-4 sm:space-y-6">
        //{/* Basic Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
          <Label htmlFor={`${idPrefix}title`} className="text-sm font-medium">
              Title*
            </Label>
            <Input
              type="text"
              id={`${idPrefix}title`}
              className="w-full"
              value={article.title || ''}
              onChange={(e) => onArticleChange({...article, title: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
          <Label htmlFor={`${idPrefix}category`} className="text-sm font-medium">
              Category*
            </Label>
            <Input
              type="text"
              id={`${idPrefix}category`}
              className="w-full"
              value={article.category || ''}
              onChange={(e) => onArticleChange({...article, category: e.target.value})}
            />
          </div>
          
         {/* <div className="space-y-2">
            <Label className="text-sm font-medium">Author</Label>
            <div className="w-full py-2 px-3 bg-muted rounded">{userName}</div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Author Image</Label>
            <img
              src={userImageUrl || '/default-author-image.jpg'}
              alt={userName}
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>*/}
        </div>
        
        {/* Excerpt */}
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}excerpt`} className="text-sm font-medium">
            Excerpt
          </Label>
          <Textarea 
            id={`${idPrefix}excerpt`}
            className="w-full resize-none"
            rows={3}
            value={article.excerpt || ''}
            onChange={(e) => onArticleChange({...article, excerpt: e.target.value})}
          />
        </div>
        
        {/* Content Editor */}
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}content`} className="text-sm font-medium">
            Content
          </Label>
          <div className="min-h-[300px] sm:min-h-[400px]">
            <RichTextEditor
              value={article.content || ''}
              onChange={(value) => onArticleChange({...article, content: value})}
            />
          </div>
        </div>
        
        {/* Auto Update Toggle */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Switch
              id={`${idPrefix}auto-update`}
              checked={article.is_auto_update || false}
              onCheckedChange={(checked) => 
                onArticleChange({...article, is_auto_update: checked})
              }
            />
            <Label htmlFor={`${idPrefix}auto-update`} className="text-sm font-medium">
              Enable automatic content updates
            </Label>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            When enabled, this article will be automatically updated when new content is available from the author.
          </p>
        </div>
        
        {/* Featured and Editor's Pick Toggles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="flex items-center space-x-2">
              <Switch
                id={`${idPrefix}featured`}
                checked={article.is_featured || false}
                onCheckedChange={(checked) => 
                  onArticleChange({...article, is_featured: checked})
                }
              />
          
              <Label htmlFor={`${idPrefix}featured`} className="text-sm font-medium">
                Featured Article
              </Label>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Featured articles will be highlighted and shown prominently on the homepage.
            </p>
          </div>
          </div>
          
          <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <Switch
                id={`${idPrefix}editors-pick`}
                checked={article.is_editors_pick || false}
                onCheckedChange={(checked) => 
                  onArticleChange({...article, is_editors_pick: checked})
                }
              />
              <Label htmlFor={`${idPrefix}editors-pick`} className="text-sm font-medium">
                Editor's Pick
              </Label>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Editor's picks will be shown in the dedicated Editor's Picks section.
            </p>
          </div>
        </div>
        
        {/* Status Selection */}
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
          <Label className="text-sm font-medium">Status</Label>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio"
                name={`${idPrefix}status`}
                value="published"
                checked={article.status === 'published'}
                onChange={() => onArticleChange({...article, status: 'published'})}
                className="w-4 h-4"
              />
              <span className="text-sm">Published</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input 
                type="radio"
                name={`${idPrefix}status`}
                value="draft"
                checked={article.status === 'draft'}
                onChange={() => onArticleChange({...article, status: 'draft'})}
                className="w-4 h-4"
              />
              <span className="text-sm">Draft</span>
            </label>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
          <Button 
            onClick={onSubmit} 
            className="w-full sm:w-auto bg-trendforge-600 hover:bg-trendforge-700 min-w-[120px]"
          >
            {submitText}
          </Button>
          {isEditing && (
            <Button 
              variant="outline" 
              onClick={onCancel}
              className="w-full sm:w-auto min-w-[120px]"
            >
              Cancel
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticleForm;