
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Edit, Trash } from 'lucide-react';
import AdBanner from '@/components/blog/AdBanner';

// Mock data with correct typing
const mockAds = [
  { id: '1', name: 'Homepage Leaderboard', type: 'leaderboard' as const, active: true, location: 'homepage' },
  { id: '2', name: 'Article Sidebar', type: 'sidebar' as const, active: true, location: 'article' },
  { id: '3', name: 'Category Rectangle', type: 'rectangle' as const, active: true, location: 'category' },
  { id: '4', name: 'Homepage Bottom', type: 'leaderboard' as const, active: false, location: 'homepage' },
];

interface Ad {
  id: string;
  name: string;
  type: 'leaderboard' | 'rectangle' | 'sidebar';
  active: boolean;
  location: string;
}

const AdManager: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>(mockAds);
  const [isAddingAd, setIsAddingAd] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [newAd, setNewAd] = useState<Partial<Ad>>({
    name: '',
    type: 'leaderboard',
    active: true,
    location: '',
  });
  
  const { toast } = useToast();

  const handleAddAd = () => {
    if (!newAd.name || !newAd.location) {
      toast({
        title: "Missing required fields",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }

    const ad: Ad = {
      ...newAd as Ad,
      id: Date.now().toString(),
    };

    setAds([...ads, ad]);
    setNewAd({
      name: '',
      type: 'leaderboard',
      active: true,
      location: '',
    });
    setIsAddingAd(false);
    
    toast({
      title: "Ad space added",
      description: "The ad space has been added successfully",
    });
  };

  const handleUpdateAd = () => {
    if (!editingAd) return;
    
    const updatedAds = ads.map(ad => 
      ad.id === editingAd.id ? editingAd : ad
    );
    
    setAds(updatedAds);
    setEditingAd(null);
    
    toast({
      title: "Ad space updated",
      description: "The ad space has been updated successfully",
    });
  };

  const handleDeleteAd = (id: string) => {
    const updatedAds = ads.filter(ad => ad.id !== id);
    setAds(updatedAds);
    
    toast({
      title: "Ad space deleted",
      description: "The ad space has been deleted successfully",
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Ad Spaces</h2>
        <Button 
          onClick={() => setIsAddingAd(!isAddingAd)}
          className="bg-trendforge-600 hover:bg-trendforge-700"
        >
          {isAddingAd ? 'Cancel' : 'Add New Ad Space'}
        </Button>
      </div>

      {isAddingAd && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Ad Space</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Ad Name*</label>
                <input 
                  type="text"
                  id="name"
                  className="w-full p-2 border rounded-md"
                  value={newAd.name}
                  onChange={(e) => setNewAd({...newAd, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">Location*</label>
                <input 
                  type="text"
                  id="location"
                  className="w-full p-2 border rounded-md"
                  value={newAd.location}
                  onChange={(e) => setNewAd({...newAd, location: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Ad Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center">
                    <input 
                      type="radio"
                      name="adType"
                      value="leaderboard"
                      checked={newAd.type === 'leaderboard'}
                      onChange={() => setNewAd({...newAd, type: 'leaderboard'})}
                      className="mr-2"
                    />
                    Leaderboard
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio"
                      name="adType"
                      value="rectangle"
                      checked={newAd.type === 'rectangle'}
                      onChange={() => setNewAd({...newAd, type: 'rectangle'})}
                      className="mr-2"
                    />
                    Rectangle
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio"
                      name="adType"
                      value="sidebar"
                      checked={newAd.type === 'sidebar'}
                      onChange={() => setNewAd({...newAd, type: 'sidebar'})}
                      className="mr-2"
                    />
                    Sidebar
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={newAd.active}
                    onChange={(e) => setNewAd({...newAd, active: e.target.checked})}
                    className="mr-2"
                  />
                  Active
                </label>
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <div className="border p-4 rounded-md">
                  {newAd.type && <AdBanner type={newAd.type as 'leaderboard' | 'rectangle' | 'sidebar'} />}
                </div>
              </div>
              
              <Button onClick={handleAddAd} className="bg-trendforge-600 hover:bg-trendforge-700">
                Add Ad Space
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {editingAd && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Edit Ad Space</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="text-sm font-medium">Ad Name*</label>
                <input 
                  type="text"
                  id="edit-name"
                  className="w-full p-2 border rounded-md"
                  value={editingAd.name}
                  onChange={(e) => setEditingAd({...editingAd, name: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="edit-location" className="text-sm font-medium">Location*</label>
                <input 
                  type="text"
                  id="edit-location"
                  className="w-full p-2 border rounded-md"
                  value={editingAd.location}
                  onChange={(e) => setEditingAd({...editingAd, location: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Ad Type</label>
                <div className="grid grid-cols-3 gap-2">
                  <label className="flex items-center">
                    <input 
                      type="radio"
                      name="edit-adType"
                      value="leaderboard"
                      checked={editingAd.type === 'leaderboard'}
                      onChange={() => setEditingAd({...editingAd, type: 'leaderboard'})}
                      className="mr-2"
                    />
                    Leaderboard
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio"
                      name="edit-adType"
                      value="rectangle"
                      checked={editingAd.type === 'rectangle'}
                      onChange={() => setEditingAd({...editingAd, type: 'rectangle'})}
                      className="mr-2"
                    />
                    Rectangle
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio"
                      name="edit-adType"
                      value="sidebar"
                      checked={editingAd.type === 'sidebar'}
                      onChange={() => setEditingAd({...editingAd, type: 'sidebar'})}
                      className="mr-2"
                    />
                    Sidebar
                  </label>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={editingAd.active}
                    onChange={(e) => setEditingAd({...editingAd, active: e.target.checked})}
                    className="mr-2"
                  />
                  Active
                </label>
              </div>
              
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Preview:</p>
                <div className="border p-4 rounded-md">
                  <AdBanner type={editingAd.type} />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={handleUpdateAd} 
                  className="bg-trendforge-600 hover:bg-trendforge-700"
                >
                  Update Ad Space
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setEditingAd(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ads.map((ad) => (
            <TableRow key={ad.id}>
              <TableCell className="font-medium">{ad.name}</TableCell>
              <TableCell className="capitalize">{ad.type}</TableCell>
              <TableCell>{ad.location}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  ad.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {ad.active ? 'Active' : 'Inactive'}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingAd(ad)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteAd(ad.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdManager;
