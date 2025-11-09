import React from 'react';
import './AlgorithmListPage.css';

const AlgorithmListPage = () => {
  const algorithmCategories = [
    {
      title: "Basics",
      algorithms: [
        { name: "Stack: Array Implementation", link: "StackArray.html" },
        { name: "Stack: Linked List Implementation", link: "StackLL.html" },
        { name: "Queues: Array Implementation", link: "QueueArray.html" },
        { name: "Queues: Linked List Implementation", link: "QueueLL.html" },
        { name: "Lists: Array Implementation", link: "java/visualization.html", note: "(available in java version)" },
        { name: "Lists: Linked List Implementation", link: "java/visualization.html", note: "(available in java version)" }
      ]
    },
    {
      title: "Recursion",
      algorithms: [
        { name: "Factorial", link: "RecFact.html" },
        { name: "Reversing a String", link: "RecReverse.html" },
        { name: "N-Queens Problem", link: "RecQueens.html" }
      ]
    },
    {
      title: "Indexing",
      algorithms: [
        { name: "Binary and Linear Search (of sorted list)", link: "Search.html" },
        { name: "Binary Search Trees", link: "BST.html" },
        { name: "AVL Trees (Balanced binary search trees)", link: "AVLtree.html" },
        { name: "Red-Black Trees", link: "RedBlack.html" },
        { name: "Splay Trees", link: "SplayTree.html" },
        { name: "Open Hash Tables (Closed Addressing)", link: "OpenHash.html" },
        { name: "Closed Hash Tables (Open Addressing)", link: "ClosedHash.html" },
        { name: "Closed Hash Tables, using buckets", link: "ClosedHashBucket.html" },
        { name: "Trie (Prefix Tree, 26-ary Tree)", link: "Trie.html" },
        { name: "Radix Tree (Compact Trie)", link: "RadixTree.html" },
        { name: "Ternary Search Tree (Trie with BST of children)", link: "TST.html" },
        { name: "B Trees", link: "BTree.html" },
        { name: "B+ Trees", link: "BPlusTree.html" }
      ]
    },
    {
      title: "Sorting",
      algorithms: [
        { 
          name: "Comparison Sorting", 
          link: "ComparisonSort.html",
          subAlgorithms: [
            "Bubble Sort",
            "Selection Sort",
            "Insertion Sort",
            "Shell Sort",
            "Merge Sort",
            "Quick Sort"
          ]
        },
        { name: "Bucket Sort", link: "BucketSort.html" },
        { name: "Counting Sort", link: "CountingSort.html" },
        { name: "Radix Sort", link: "RadixSort.html" },
        { name: "Heap Sort", link: "HeapSort.html" }
      ]
    },
    {
      title: "Heap-like Data Structures",
      algorithms: [
        { name: "Heaps", link: "Heap.html" },
        { name: "Binomial Queues", link: "BinomialQueue.html" },
        { name: "Fibonacci Heaps", link: "FibonacciHeap.html" },
        { name: "Leftist Heaps", link: "LeftistHeap.html" },
        { name: "Skew Heaps", link: "SkewHeap.html" }
      ]
    },
    {
      title: "Graph Algorithms",
      algorithms: [
        { name: "Breadth-First Search", link: "BFS.html" },
        { name: "Depth-First Search", link: "DFS.html" },
        { name: "Connected Components", link: "ConnectedComponent.html" },
        { name: "Dijkstra's Shortest Path", link: "Dijkstra.html" },
        { name: "Prim's Minimum Cost Spanning Tree", link: "Prim.html" },
        { name: "Topological Sort (Using Indegree array)", link: "TopoSortIndegree.html" },
        { name: "Topological Sort (Using DFS)", link: "TopoSortDFS.html" },
        { name: "Floyd-Warshall (all pairs shortest paths)", link: "Floyd.html" },
        { name: "Kruskal Minimum Cost Spanning Tree Algorithm", link: "Kruskal.html" }
      ]
    },
    {
      title: "Dynamic Programming",
      algorithms: [
        { name: "Calculating nth Fibonacci number", link: "DPFib.html" },
        { name: "Making Change", link: "DPChange.html" },
        { name: "Longest Common Subsequence", link: "DPLCS.html" }
      ]
    },
    {
      title: "Geometric Algorithms",
      algorithms: [
        { name: "2D Rotation and Scale Matrices", link: "RotateScale2D.html" },
        { name: "2D Rotation and Translation Matrices", link: "RotateTranslate2D.html" },
        { name: "2D Changing Coordinate Systems", link: "ChangingCoordinates2D.html" },
        { name: "3D Rotation and Scale Matrices", link: "RotateScale3D.html" },
        { name: "3D Changing Coordinate Systems", link: "ChangingCoordinates3D.html" }
      ]
    },
    {
      title: "Others",
      algorithms: [
        { name: "Disjoint Sets", link: "DisjointSets.html" },
        { name: "Huffman Coding", link: "java/visualization.html", note: "(available in java version)" }
      ]
    }
  ];

  return (
    <div className="algorithm-list-page">
      <h1>Data Structure Visualizations</h1>
      <p>Currently, we have visualizations for the following data structures and algorithms:</p>

      {algorithmCategories.map((category, index) => (
        <div key={index} className="category-section">
          <h2>{category.title}</h2>
          <ul>
            {category.algorithms.map((algo, algoIndex) => (
              <li key={algoIndex}>
                <a href={algo.link}>
                  {algo.name}
                </a>
                {algo.note && <span> {algo.note}</span>}
                
                {algo.subAlgorithms && (
                  <ul>
                    {algo.subAlgorithms.map((subAlgo, subIndex) => (
                      <li key={subIndex}>{subAlgo}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="footer">
        Copyright 2025 <a href="https://nullsect-portfolio.vercel.app/">Bilal Aniq</a>
      </div>
    </div>
  );
};

export default AlgorithmListPage;