
import React, { useState, useEffect } from 'react';
import { apiClient } from '@/integrations/client';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Trash, Loader2 } from 'lucide-react';
import { Category } from '@/integrations/types';

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    slug: '',
  });

  const { toast } = useToast();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('categories/'); // Fetch categories from Django API
      const formattedCategories = response.data.map((category: Category) => ({
        ...category,
        count: category.count || 0, // Ensure count is set to 0 if not provided
      }));
      setCategories(formattedCategories);
    } catch (error: any) {
      toast({
        title: 'Error fetching categories',
        description: error.response?.data?.detail || 'Could not fetch categories',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  const handleAddCategory = async () => {
    if (!newCategory.name) {
      toast({
        title: 'Missing required fields',
        description: 'Please enter a category name',
        variant: 'destructive',
      });
      return;
    }

    const slug = newCategory.slug || generateSlug(newCategory.name);

    // Check for duplicate slug
    if (categories.some((cat) => cat.slug === slug)) {
      toast({
        title: 'Duplicate slug',
        description: 'A category with this slug already exists',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.post('categories/', {
        name: newCategory.name,
        slug: slug,
        count: 0,
      }); // Add a new category to Django API

      setCategories([...categories, response.data]); // Add the new category to the list
      setNewCategory({ name: '', slug: '' }); // Reset the form
      setIsAddingCategory(false);

      toast({
        title: 'Category added',
        description: 'The category has been added successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error adding category',
        description: error.response?.data?.detail || 'Could not add category',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editingCategory.name) return;

    const slug = editingCategory.slug || generateSlug(editingCategory.name);

    // Check for duplicate slug (excluding the current category)
    if (categories.some((cat) => cat.slug === slug && cat.id !== editingCategory.id)) {
      toast({
        title: 'Duplicate slug',
        description: 'A category with this slug already exists',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiClient.put(`categories/${editingCategory.id}/`, {
        name: editingCategory.name,
        slug: slug,
      }); // Update the category in Django API

      const updatedCategories = categories.map((category) =>
        category.id === editingCategory.id ? { ...response.data } : category
      );

      setCategories(updatedCategories);
      setEditingCategory(null);

      toast({
        title: 'Category updated',
        description: 'The category has been updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error updating category',
        description: error.response?.data?.detail || 'Could not update category',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    setIsLoading(true);

    try {
      await apiClient.delete(`categories/${id}/`); // Delete the category from Django API

      const updatedCategories = categories.filter((category) => category.id !== id);
      setCategories(updatedCategories);

      toast({
        title: 'Category deleted',
        description: 'The category has been deleted successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error deleting category',
        description: error.response?.data?.detail || 'Could not delete category',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const name = e.target.value;
    const slug = generateSlug(name);

    if (isEditing && editingCategory) {
      setEditingCategory({ ...editingCategory, name, slug });
    } else {
      setNewCategory({ ...newCategory, name, slug });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Categories</h2>
        <Button 
          onClick={() => setIsAddingCategory(!isAddingCategory)}
          className="bg-trendforge-600 hover:bg-trendforge-700"
          disabled={isLoading}
        >
          {isAddingCategory ? 'Cancel' : 'Add New Category'}
        </Button>
      </div>

      {isAddingCategory && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Category Name*</label>
                <input 
                  type="text"
                  id="name"
                  className="w-full p-2 border rounded-md"
                  value={newCategory.name}
                  onChange={(e) => handleNameChange(e, false)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="slug" className="text-sm font-medium">Slug</label>
                <input 
                  type="text"
                  id="slug"
                  className="w-full p-2 border rounded-md"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({...newCategory, slug: e.target.value})}
                  placeholder="Auto-generated from name if left empty"
                />
              </div>
              
              <Button 
                onClick={handleAddCategory} 
                className="bg-trendforge-600 hover:bg-trendforge-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Adding...
                  </>
                ) : (
                  'Add Category'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {editingCategory && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Edit Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">Category Name*</label>
                <input 
                  type="text"
                  id="edit-name"
                  className="w-full p-2 border rounded-md"
                  value={editingCategory.name}
                  onChange={(e) => handleNameChange(e, true)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit-slug" className="text-sm font-medium">Slug</label>
                <input 
                  type="text"
                  id="edit-slug"
                  className="w-full p-2 border rounded-md"
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({...editingCategory, slug: e.target.value})}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleUpdateCategory} 
                  className="bg-trendforge-600 hover:bg-trendforge-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Updating...
                    </>
                  ) : (
                    'Update Category'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setEditingCategory(null)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading && !isAddingCategory && !editingCategory ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-trendforge-600" />
          <span className="ml-2">Loading categories...</span>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Article Count</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  No categories found. Add your first category to get started.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell>{category.slug}</TableCell>
                  <TableCell>{category.count}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setEditingCategory(category)}
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={isLoading}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default CategoryManager;
