import { createContext, ReactNode, useEffect, useState } from 'react'
import { api } from '../lib/axios'

interface TransactionInterface {
  id: number
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  createdAt: string
}

interface CreateTransactionInterface {
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
}

interface TransactionContextType {
  transactions: TransactionInterface[]
  fetchTransactions: (query?: string) => Promise<void>
  createTransaction: (data: CreateTransactionInterface) => Promise<void>
}

interface TransactionsProviderProps {
  children: ReactNode
}

export const TransactionsContext = createContext<TransactionContextType>(
  {} as TransactionContextType,
)

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<TransactionInterface[]>([])

  async function fetchTransactions(query?: string) {
    const { data } = await api.get<TransactionInterface[]>('transactions', {
      params: {
        _sort: 'createdAt',
        _order: 'desc',
        q: query,
      },
    })

    setTransactions(data)
  }

  async function createTransaction({
    description,
    category,
    price,
    type,
  }: CreateTransactionInterface) {
    const { data } = await api.post('transactions', {
      description,
      category,
      price,
      type,
      createdAt: new Date(),
    })

    setTransactions((state) => [data, ...state])
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        fetchTransactions,
        createTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  )
}
