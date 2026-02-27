import { Plane, Map } from 'lucide-react';

interface TripTypeSelectorProps {
  selected: 'round-trip' | 'one-way' | 'multi-city';
  onChange: (type: 'round-trip' | 'one-way' | 'multi-city') => void;
}

export function TripTypeSelector({ selected, onChange }: TripTypeSelectorProps) {
  const types = [
    { value: 'round-trip' as const, label: 'Round Trip', icon: Plane },
    { value: 'one-way' as const, label: 'One Way', icon: Plane },
    { value: 'multi-city' as const, label: 'Multi-City', icon: Map },
  ];

  return (
    <div className="flex gap-2 mb-4">
      {types.map((type) => (
        <button
          key={type.value}
          onClick={() => onChange(type.value)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            selected === type.value
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <type.icon className="w-4 h-4" />
          {type.label}
        </button>
      ))}
    </div>
  );
}
