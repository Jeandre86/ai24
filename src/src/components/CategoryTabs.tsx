import React from 'react';

interface CategoryTabsProps {
  categories: { id: string; label: string }[];
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategoryTabs({ categories, selectedCategory, onSelectCategory }: CategoryTabsProps) {
  return (
    <div className="flex gap-4 border-b border-border overflow-x-auto pb-4 mb-8">
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`whitespace-nowrap px-4 py-2 font-semibold text-sm transition-colors relative ${
            selectedCategory === category.id
              ? 'text-accent'
              : 'text-secondary hover:text-primary'
          }`}>
          {category.label}
          {selectedCategory === category.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
          )}
        </button>
      ))}
    </div>
  );
}
