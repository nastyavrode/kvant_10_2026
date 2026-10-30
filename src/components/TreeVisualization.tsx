import React, { useState } from 'react';
import { RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface TreeNode {
  value: number;
  left?: TreeNode;
  right?: TreeNode;
}

function buildSampleTree(): TreeNode {
  return {
    value: 50,
    left: {
      value: 30,
      left: { value: 20, left: { value: 10 }, right: { value: 25 } },
      right: { value: 40 }
    },
    right: {
      value: 70,
      left: { value: 60 },
      right: { value: 80, right: { value: 90 } }
    }
  };
}

export default function TreeVisualization() {
  const [rotation, setRotation] = useState({ x: 10, y: 0 });
  const [scale, setScale] = useState(1);
  const tree = buildSampleTree();

  const renderNode = (node: TreeNode | undefined, depth: number, index: number, totalAtDepth: number): React.ReactNode => {
    if (!node) return null;

    const offset = (index - (totalAtDepth - 1) / 2) * (200 / Math.pow(1.3, depth));

    return (
      <div
        key={`${depth}-${index}`}
        className="absolute flex flex-col items-center"
        style={{
          transform: `translate3d(${offset}px, ${depth * 80}px, ${depth * 20}px)`,
          transition: 'transform 0.5s ease',
        }}
      >
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white/20">
          {node.value}
        </div>
        <div className="flex gap-16 mt-2 relative">
          {node.left && (
            <>
              <div className="absolute -top-2 left-1/2 w-0.5 h-4 bg-indigo-300 -rotate-45 origin-top" />
              {renderNode(node.left, depth + 1, index * 2, totalAtDepth * 2)}
            </>
          )}
          {node.right && (
            <>
              <div className="absolute -top-2 left-1/2 w-0.5 h-4 bg-indigo-300 rotate-45 origin-top" />
              {renderNode(node.right, depth + 1, index * 2 + 1, totalAtDepth * 2)}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">🌳 3D Визуализация BST</h3>
        <div className="flex gap-2">
          <button onClick={() => setRotation(r => ({ ...r, y: r.y - 15 }))} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition" title="Повернуть влево">
            <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button onClick={() => setScale(s => Math.min(s + 0.1, 1.5))} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
            <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button onClick={() => setScale(s => Math.max(s - 0.1, 0.5))} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
            <ZoomOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <div className="relative h-80 overflow-hidden rounded-lg bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800" style={{ perspective: '800px' }}>
        <div
          className="absolute inset-0 flex items-start justify-center pt-8"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale(${scale})`,
            transition: 'transform 0.5s ease',
          }}
        >
          {renderNode(tree, 0, 0, 1)}
        </div>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
        Бинарное дерево поиска (BST). Используйте кнопки для вращения и масштабирования.
      </p>
    </div>
  );
}
