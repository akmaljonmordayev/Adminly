import React from 'react'
import { Table } from 'antd'

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    render: (text) => (
      <span className="font-medium text-slate-800">{text}</span>
    ),
  },
  {
    title: 'Age',
    dataIndex: 'age',
    render: (age) => (
      <span className="text-slate-600">{age}</span>
    ),
  },
  {
    title: 'Address',
    dataIndex: 'address',
    render: (text) => (
      <span className="text-slate-500">{text}</span>
    ),
  },
]

const dataSource = Array.from({ length: 46 }).map((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32,
  address: `London, Park Lane no. ${i}`,
}))

const Finance = () => {
  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800">
            Finance
          </h2>

          <input
            placeholder="Search..."
            className="px-3 py-2 text-sm border border-slate-300 rounded-md
              focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="p-6">
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={{ pageSize: 10 }}
          />
        </div>

      </div>
    </div>
  )
}

export default Finance
