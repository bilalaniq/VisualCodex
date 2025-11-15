import React from 'react';
import { Link } from 'react-router-dom';
import './AlgorithmListPage.css';
import Footer from '../components/Footer';

const AlgorithmListPage = () => {
  const algorithmCategories = [
    {
      title: "Basics",
      algorithms: [
        { name: "Stack: Array Implementation", link: "/stack-array" },
        { name: "Stack: Linked List Implementation", link: "/stack-linked-list", note: "(coming soon)" },
        { name: "Queues: Array Implementation", link: "/queue-array", note: "(coming soon)" },
        { name: "Queues: Linked List Implementation", link: "/queue-linked-list", note: "(coming soon)" },
        { name: "Lists: Array Implementation", link: "/list-array", note: "(coming soon)" },
        { name: "Lists: Linked List Implementation", link: "/list-linked-list", note: "(coming soon)" }
      ]
    },
    {
      title: "Recursion",
      algorithms: [
        { name: "Factorial", link: "/recursion-factorial", note: "(coming soon)" },
        { name: "Reversing a String", link: "/recursion-reverse", note: "(coming soon)" },
        { name: "N-Queens Problem", link: "/recursion-queens", note: "(coming soon)" }
      ]
    },
    {
      title: "Indexing",
      algorithms: [
        { name: "Binary and Linear Search (of sorted list)", link: "/search", note: "(coming soon)" },
        { name: "Binary Search Trees", link: "/bst", note: "(coming soon)" },
        { name: "AVL Trees (Balanced binary search trees)", link: "/avl-tree", note: "(coming soon)" },
        { name: "Red-Black Trees", link: "/red-black", note: "(coming soon)" },
        { name: "Splay Trees", link: "/splay-tree", note: "(coming soon)" },
        { name: "Open Hash Tables (Closed Addressing)", link: "/open-hash", note: "(coming soon)" },
        { name: "Closed Hash Tables (Open Addressing)", link: "/closed-hash", note: "(coming soon)" },
        { name: "Closed Hash Tables, using buckets", link: "/closed-hash-bucket", note: "(coming soon)" },
        { name: "Trie (Prefix Tree, 26-ary Tree)", link: "/trie", note: "(coming soon)" },
        { name: "Radix Tree (Compact Trie)", link: "/radix-tree", note: "(coming soon)" },
        { name: "Ternary Search Tree (Trie with BST of children)", link: "/ternary-search-tree", note: "(coming soon)" },
        { name: "B Trees", link: "/b-tree", note: "(coming soon)" },
        { name: "B+ Trees", link: "/b-plus-tree", note: "(coming soon)" }
      ]
    },
    {
      title: "Sorting",
      algorithms: [
        { 
          name: "Comparison Sorting", 
          link: "/comparison-sort",
          note: "(coming soon)",
          subAlgorithms: [
            "Bubble Sort",
            "Selection Sort",
            "Insertion Sort",
            "Shell Sort",
            "Merge Sort",
            "Quick Sort"
          ]
        },
        { name: "Bucket Sort", link: "/bucket-sort", note: "(coming soon)" },
        { name: "Counting Sort", link: "/counting-sort", note: "(coming soon)" },
        { name: "Radix Sort", link: "/radix-sort", note: "(coming soon)" },
        { name: "Heap Sort", link: "/heap-sort", note: "(coming soon)" }
      ]
    },
    {
      title: "Heap-like Data Structures",
      algorithms: [
        { name: "Heaps", link: "/heap", note: "(coming soon)" },
        { name: "Binomial Queues", link: "/binomial-queue", note: "(coming soon)" },
        { name: "Fibonacci Heaps", link: "/fibonacci-heap", note: "(coming soon)" },
        { name: "Leftist Heaps", link: "/leftist-heap", note: "(coming soon)" },
        { name: "Skew Heaps", link: "/skew-heap", note: "(coming soon)" }
      ]
    },
    {
      title: "Graph Algorithms",
      algorithms: [
        { name: "Breadth-First Search", link: "/bfs", note: "(coming soon)" },
        { name: "Depth-First Search", link: "/dfs", note: "(coming soon)" },
        { name: "Connected Components", link: "/connected-components", note: "(coming soon)" },
        { name: "Dijkstra's Shortest Path", link: "/dijkstra", note: "(coming soon)" },
        { name: "Prim's Minimum Cost Spanning Tree", link: "/prim", note: "(coming soon)" },
        { name: "Topological Sort (Using Indegree array)", link: "/topo-sort-indegree", note: "(coming soon)" },
        { name: "Topological Sort (Using DFS)", link: "/topo-sort-dfs", note: "(coming soon)" },
        { name: "Floyd-Warshall (all pairs shortest paths)", link: "/floyd-warshall", note: "(coming soon)" },
        { name: "Kruskal Minimum Cost Spanning Tree Algorithm", link: "/kruskal", note: "(coming soon)" }
      ]
    },
    {
      title: "Dynamic Programming",
      algorithms: [
        { name: "Calculating nth Fibonacci number", link: "/dp-fib", note: "(coming soon)" },
        { name: "Making Change", link: "/dp-change", note: "(coming soon)" },
        { name: "Longest Common Subsequence", link: "/dp-lcs", note: "(coming soon)" }
      ]
    },
    {
      title: "Geometric Algorithms",
      algorithms: [
        { name: "2D Rotation and Scale Matrices", link: "/2d-rotate-scale", note: "(coming soon)" },
        { name: "2D Rotation and Translation Matrices", link: "/2d-rotate-translate", note: "(coming soon)" },
        { name: "2D Changing Coordinate Systems", link: "/2d-changing-coordinates", note: "(coming soon)" },
        { name: "3D Rotation and Scale Matrices", link: "/3d-rotate-scale", note: "(coming soon)" },
        { name: "3D Changing Coordinate Systems", link: "/3d-changing-coordinates", note: "(coming soon)" }
      ]
    },
    {
      title: "Others",
      algorithms: [
        { name: "Disjoint Sets", link: "/disjoint-sets", note: "(coming soon)" },
        { name: "Huffman Coding", link: "/huffman-coding", note: "(coming soon)" }
      ]
    }
  ];

  return (
    <div className="algorithm-list-page">
      <header className="page-header">
        <h1>Data Structure Visualizations</h1>
        <p className="page-subtitle">
          Interactive visualizations to help you understand how data structures and algorithms work
        </p>
      </header>

      <div className="content-section">
        <p>Currently, we have visualizations for the following data structures and algorithms:</p>

        {algorithmCategories.map((category, index) => (
          <div key={index} className="category-section">
            <h2 className="category-title">{category.title}</h2>
            <ul className="algorithm-list">
              {category.algorithms.map((algo, algoIndex) => (
                <li key={algoIndex} className="algorithm-item">
                  <div className="algorithm-link-container">
                    <Link
                      to={algo.link}
                      className={`algorithm-link ${algo.note?.includes('coming soon') ? 'coming-soon' : ''}`}
                    >
                      {algo.name}
                    </Link>
                    {algo.note && <span className="note"> {algo.note}</span>}
                  </div>
                  
                  {algo.subAlgorithms && (
                    <ul className="sub-algorithm-list">
                      {algo.subAlgorithms.map((subAlgo, subIndex) => (
                        <li key={subIndex} className="sub-algorithm-item">
                          {subAlgo}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Footer />
    </div>
  );
};

export default AlgorithmListPage;