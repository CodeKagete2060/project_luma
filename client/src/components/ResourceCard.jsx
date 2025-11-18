import React from 'react';

export default function ResourceCard({ resource }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <h4 className="font-semibold text-gray-800">{resource.title}</h4>
      <p className="text-sm text-gray-500">{resource.subject} • {resource.tags?.join(', ')}</p>
      <p className="text-sm text-gray-600 mt-2">{resource.summary}</p>
      <div className="mt-4 flex items-center justify-between">
        <a className="text-[#2C139E] hover:underline" href={resource.fileUrl} target="_blank" rel="noreferrer">Open</a>
        <a className="px-3 py-1 bg-gray-100 rounded" href={resource.fileUrl} download>Download</a>
      </div>
    </div>
  );
}
