import React from 'react';
import { Trash2, User } from 'lucide-react';

interface Person {
  id: string;
  name: string;
  image_path: string;
}

interface PersonListProps {
  people: Person[];
  onDelete: (id: string) => void;
}

export const PersonList: React.FC<PersonListProps> = ({ people, onDelete }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {people.map((person) => (
      <div key={person.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between group">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
            <img src={`${person.image_path}`} alt={person.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-white font-medium">{person.name}</div>
            <div className="text-slate-500 text-xs flex items-center gap-1">
              <User className="w-3 h-3" /> ID: {person.id}
            </div>
          </div>
        </div>
        <button 
          onClick={() => onDelete(person.id)}
          className="p-2 text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ))}
  </div>
);
