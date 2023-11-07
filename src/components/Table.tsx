'use client'
//#region - Imports
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronDown,
  Loader2,
  MoreHorizontal,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { SyntheticEvent, useEffect, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table'
//#endregion - Imports

export interface User {
  id: number
  name: string
  email: string
  birthday_date: string
  phone_number: string
  address: string
}

type ColumnVisibility = {
  id: boolean
  name: boolean
  email: boolean
  birthday_date: boolean
  phone_number: boolean
  address: boolean
}

const AVAILABLE_TABLE_USERS_COUNT = [10, 15, 20, 25, 30]
const AVAILABLE_TABLE_COLUMN_LIST = {
  name: 'Name',
  email: 'Email',
  birthday_date: 'Birthday Date',
  phone_number: 'Phone Number',
  address: 'Address',
}

export function DataTable() {
  const [dataTable, setDataTable] = useState<User[]>([])
  const [usersCount, setUsersCount] = useState<number>(0)
  const [editUserID, setEditUserID] = useState<number>(-1)
  const [editUserTemp, setEditUserTemp] = useState<User>({} as User)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [sorting, setSorting] = useState<keyof Omit<User, 'id'>>('name')
  const [order, setOrder] = useState<'ASC' | 'DESC' | null>(null)
  const [searchEmail, setSearchEmail] = useState<string>('')
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    id: false,
    name: true,
    email: true,
    birthday_date: true,
    phone_number: true,
    address: true,
  })

  const [usersPerPage, setUsersPerPage] = useState<number>(
    AVAILABLE_TABLE_USERS_COUNT[0]
  )

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [editCurrentPageTemp, setEditCurrentPageTemp] = useState<string>(
    currentPage.toString()
  )

  const [offset, setOffset] = useState<number>(usersPerPage * (currentPage - 1))

  const [filteredColumns, setFilteredColumns] = useState<[string, string][]>(
    Object.entries(AVAILABLE_TABLE_COLUMN_LIST)
  )
  const getPreparedData = ({
    data,
    search,
    sorting,
    order,
  }: {
    data: User[]
    search: string
    sorting: keyof Omit<User, 'id'>
    order: 'ASC' | 'DESC' | null
  }): User[] => {
    let newValue = data.map((user) => {
      return {
        ...user,
        birthday_date: formatDate(user.birthday_date),
      }
    })

    if (search.length > 0) {
      newValue = data.filter((user) =>
        user.email.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (sorting.length > 0 && order !== null) {
      if (order === 'ASC') {
        newValue.sort((a, b) => a[sorting].localeCompare(b[sorting]))
      } else {
        newValue.sort((a, b) => b[sorting].localeCompare(a[sorting]))
      }
    }

    return newValue
  }

  const preparedTableData = getPreparedData({
    data: dataTable,
    search: searchEmail,
    sorting: sorting,
    order: order,
  })

  const pagesSummaryCount = Math.ceil(usersCount / usersPerPage)

  function formatDate(inputDate: string) {
    const parts = inputDate.split('-')
    const day = parts[0]
    const month = parts[1]
    const year = parts[2]

    const fullYear = +year < 24 ? `20${year}` : `19${year}`
    const formattedDate = `${fullYear}-${month}-${day}`

    return formattedDate
  }

  const handleCurrentPageChange = (event: SyntheticEvent<HTMLInputElement>) => {
    event.preventDefault()

    const value = parseInt(
      event.currentTarget.value
        .split('')
        .filter((symbol) => '0123456789'.includes(symbol))
        .join(''),
      10
    )

    setEditCurrentPageTemp(`${value}`)
  }

  const handleSaveEdit = async () => {
    const { id, ...reqBody } = editUserTemp

    await fetch(`/api/table/${id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reqBody),
    })
      .catch((error) => {
        throw new Error(error)
      })
      .then((response) => response.json())
      .then((data) => {
        setDataTable((prev) => {
          const newData = prev.map((user) => {
            if (user.id === id) {
              return data
            }
            return user
          })
          return newData
        })
        setEditUserID(-1)
        setEditUserTemp({} as User)
        setCurrentPage((prev) => prev)
      })
  }

  useEffect(() => {
    setIsLoading(true)
    setOffset(usersPerPage * (currentPage - 1))

    fetch(`/api/table/?limit=${usersPerPage}&offset=${offset}`)
      .then((response) => response.json())
      .then((data) => {
        setDataTable(data.results)
        setUsersCount(data.count)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [offset, usersPerPage, currentPage])

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setCurrentPage(parseInt(editCurrentPageTemp, 10))
    }, 1500)

    return () => {
      clearTimeout(debounceTimeout)
    }
  }, [editCurrentPageTemp])

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search emails..."
          value={searchEmail}
          onChange={(event) => setSearchEmail(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {usersPerPage} users/page <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {AVAILABLE_TABLE_USERS_COUNT.map((count) => {
              return (
                <DropdownMenuCheckboxItem
                  key={count}
                  className="capitalize"
                  checked={count === usersPerPage}
                  onCheckedChange={() => setUsersPerPage(count)}
                >
                  {count}
                </DropdownMenuCheckboxItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.entries(AVAILABLE_TABLE_COLUMN_LIST).map(
              ([key, columnName]) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={key}
                    className="capitalize"
                    checked={columnVisibility[key as keyof ColumnVisibility]}
                    onCheckedChange={(value) =>
                      setColumnVisibility((prev) => {
                        return { ...prev, [key]: value }
                      })
                    }
                  >
                    {columnName}
                  </DropdownMenuCheckboxItem>
                )
              }
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        {isLoading ? (
          <Loader2
            className="mx-auto my-8 h-8 w-8 animate-spin justify-self-center text-primary-foreground"
            color="#16a34a"
          />
        ) : (
          <Table>
            <TableHeader className="rounded-md border-b px-2 py-1 text-center font-medium capitalize">
              {filteredColumns.map(([key, header]) => (
                <TableHead
                  key={key}
                  className="text-center font-medium"
                  hidden={!columnVisibility[key as keyof ColumnVisibility]}
                >
                  <Button
                    variant={'ghost'}
                    className="flex items-center justify-center"
                    onClick={() => {
                      setSorting(key as keyof Omit<User, 'id'>)
                      if (order === null || order === 'DESC') {
                        setOrder('ASC')
                      }
                      if (order === 'ASC') {
                        setOrder('DESC')
                      }
                    }}
                  >
                    {header}
                    {sorting === key && order === 'ASC' ? (
                      <ArrowDown className="ml-2 h-4 w-4" />
                    ) : sorting === key && order === 'DESC' ? (
                      <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </TableHead>
              ))}
            </TableHeader>
            <TableBody className="items-center rounded-md">
              {preparedTableData.map((user: User) => {
                return (
                  <TableRow
                    key={user.id}
                    className="border-b p-1 last:border-none"
                  >
                    {Object.keys(user).map((key) => (
                      <TableCell
                        className="py-0"
                        key={key}
                        hidden={
                          !columnVisibility[key as keyof ColumnVisibility]
                        }
                      >
                        {editUserID === user.id ? (
                          <Input
                            value={editUserTemp?.[key as keyof User]}
                            className="m-0"
                            onChange={(event) => {
                              setEditUserTemp((prev) => ({
                                ...prev,
                                [key]: event.target.value,
                              }))
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                setEditUserID(-1)
                                handleSaveEdit()
                              }
                              if (e.key === 'Escape') {
                                setEditUserID(-1)
                                setEditUserTemp({} as User)
                              }
                            }}
                          />
                        ) : (
                          (user as User)[key as keyof User]
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="flex w-fit justify-center px-4">
                      {editUserID === user.id ? (
                        <Button
                          variant="outline"
                          className="h-8 w-8 px-6"
                          onClick={handleSaveEdit}
                        >
                          {'Save'}
                        </Button>
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="flex items-center text-center"
                              onClick={() => {
                                if (editUserID === user.id) {
                                  setEditUserID(-1)
                                  setEditUserTemp({} as User)
                                } else {
                                  setEditUserID(user.id)
                                  setEditUserTemp(user)
                                }
                              }}
                            >
                              {'Start Edit'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                navigator.clipboard.writeText(user.email)
                              }
                            >
                              Copy Email
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                navigator.clipboard.writeText(user.phone_number)
                              }
                            >
                              Copy Phone
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  `${user.birthday_date}`
                                )
                              }
                            >
                              Copy Birthday
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                navigator.clipboard.writeText(user.address)
                              }
                            >
                              Copy Address
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsLoading(true)
              setCurrentPage((prev) => prev - 1)
              setEditCurrentPageTemp(`${+editCurrentPageTemp - 1}`)
            }}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setIsLoading(true)
              setCurrentPage((prev) => prev + 1)
              setEditCurrentPageTemp(`${+editCurrentPageTemp + 1}`)
            }}
            disabled={currentPage === pagesSummaryCount}
          >
            Next
          </Button>
          <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <input
              className="w-6 items-center border-none bg-transparent text-center focus:outline-none"
              type="text"
              value={editCurrentPageTemp}
              onChange={handleCurrentPageChange}
              onBlur={handleCurrentPageChange}
            />
            {`/ ${pagesSummaryCount}`}
          </div>
        </div>
      </div>
    </div>
  )
}
