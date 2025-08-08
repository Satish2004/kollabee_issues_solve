import React from 'react';
import { Search, Filter } from 'lucide-react';
import type { FilterType, ConversationWithMetrics } from './use-supplier-metrics';

interface SupplierInboxFiltersProps {
    conversations: ConversationWithMetrics[];
    activeFilter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export default function SupplierInboxFilters({
    conversations,
    activeFilter,
    onFilterChange,
    searchTerm,
    onSearchChange
}: SupplierInboxFiltersProps) {
    const getFilterCount = (filter: FilterType): number => {
        switch (filter) {
            case 'all':
                return conversations.length;
            case 'unread':
                return conversations.filter(c => c.unreadCount > 0).length;
            case 'needs_reply':
                return conversations.filter(c => c.awaitingReply).length;
            case 'flagged':
                return conversations.filter(c => c.isFlagged).length;
            case 'archive':
                return conversations.filter(c => c.isArchived).length;
            default:
                return 0;
        }
    };

    const filters = [
        { key: 'all' as FilterType, label: 'All' },
        { key: 'unread' as FilterType, label: 'Unread' },
        { key: 'needs_reply' as FilterType, label: 'Needs Reply' },
        { key: 'flagged' as FilterType, label: 'Flagged' },
        { key: 'archive' as FilterType, label: 'Archive' }
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            {/* Search and Filter Header */}
            <div className="p-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Filter className="h-4 w-4" />
                        <span>Filter by:</span>
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex overflow-x-auto">
                {filters.map((filter) => {
                    const count = getFilterCount(filter.key);
                    const isActive = activeFilter === filter.key;

                    return (
                        <button
                            key={filter.key}
                            onClick={() => onFilterChange(filter.key)}
                            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${isActive
                                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <span>{filter.label}</span>
                            {count > 0 && (
                                <span className={`ml-2 px-2 py-1 text-xs rounded-full ${isActive
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-600'
                                    }`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}