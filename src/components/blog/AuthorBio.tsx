
import React from 'react';

interface AuthorBioProps {
  author: {
    name: string;
    image_url: string;
    bio: string;
  };
}

const AuthorBio: React.FC<AuthorBioProps> = ({ author }) => {
  return (
    <div className="bg-secondary p-6 rounded-lg mb-8">
      <div className="flex items-start space-x-4">
        <img 
          src={author.image_url} 
          alt={author.name} 
          className="w-16 h-16 rounded-full"
        />
        <div>
          <h3 className="text-lg font-bold mb-2">About {author.name}</h3>
          <p className="text-muted-foreground">{author.bio}</p>
        </div>
      </div>
    </div>
  );
};

export default AuthorBio;
