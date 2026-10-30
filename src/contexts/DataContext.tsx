import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Note, QuizResult, Course, Topic } from '../types';
import { demoCourse, demoNotes, demoQuizResults } from '../data/demoData';
import { useAuth } from './AuthContext';

interface DataContextType {
  course: Course;
  notes: Note[];
  quizResults: QuizResult[];
  addNote: (note: Note) => void;
  updateNote: (note: Note) => void;
  deleteNote: (noteId: string) => void;
  addQuizResult: (result: QuizResult) => void;
  getNotesByTopic: (topicId: string) => Note[];
  getQuizResultsByTopic: (topicId: string) => QuizResult[];
  getMyNotes: () => Note[];
  getSharedNotes: () => Note[];
  searchNotes: (query: string) => Note[];
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [course] = useState<Course>(demoCourse);

  useEffect(() => {
    const savedNotes = localStorage.getItem('smartNotes_notes');
    const savedResults = localStorage.getItem('smartNotes_results');
    setNotes(savedNotes ? JSON.parse(savedNotes) : demoNotes);
    setQuizResults(savedResults ? JSON.parse(savedResults) : demoQuizResults);
  }, []);

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes);
    localStorage.setItem('smartNotes_notes', JSON.stringify(newNotes));
  };

  const saveResults = (newResults: QuizResult[]) => {
    setQuizResults(newResults);
    localStorage.setItem('smartNotes_results', JSON.stringify(newResults));
  };

  const addNote = (note: Note) => {
    const newNotes = [...notes, note];
    saveNotes(newNotes);
  };

  const updateNote = (updatedNote: Note) => {
    const newNotes = notes.map(n => n.id === updatedNote.id ? updatedNote : n);
    saveNotes(newNotes);
  };

  const deleteNote = (noteId: string) => {
    const newNotes = notes.filter(n => n.id !== noteId);
    saveNotes(newNotes);
  };

  const addQuizResult = (result: QuizResult) => {
    const newResults = [...quizResults, result];
    saveResults(newResults);
  };

  const getNotesByTopic = (topicId: string) => notes.filter(n => n.topicId === topicId);

  const getQuizResultsByTopic = (topicId: string) => quizResults.filter(r => r.topicId === topicId);

  const getMyNotes = () => {
    if (!user) return [];
    return notes.filter(n => n.authorId === user.id);
  };

  const getSharedNotes = () => notes.filter(n => n.isShared);

  const searchNotes = (query: string) => {
    const q = query.toLowerCase();
    return notes.filter(n => {
      const titleMatch = n.title.toLowerCase().includes(q);
      const blockMatch = n.blocks.some(b => b.content.toLowerCase().includes(q));
      return titleMatch || blockMatch;
    });
  };

  return (
    <DataContext.Provider value={{
      course,
      notes,
      quizResults,
      addNote,
      updateNote,
      deleteNote,
      addQuizResult,
      getNotesByTopic,
      getQuizResultsByTopic,
      getMyNotes,
      getSharedNotes,
      searchNotes,
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
}
