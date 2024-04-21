'use client';
import React, { useState, useEffect } from 'react';
import NavBar from '@/app/component/navBar';
import { useContextProvider } from '@/app/utils/globalContext';
import TransactionService from '@/app/services/transactionService';
import { useUserAuth } from '@/app/utils/authContext';
import Pagination from '@/app/component/pagination';
import Spinner from '@/app/component/spinner';

export default function ManageTransaction() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [error, setError] = useState(null);
  const { refreshCount, setRefreshCount, menuHeight } = useContextProvider();


  const [searchedTransactions, setSearchedTransactions] = useState([]);
  const [filters, setFilters] = useState({ role: '', status: '', plan: '' });
  const [searchValue, setSearchValue] = useState(''); // Assuming you want to search by user name



  const { user } = useUserAuth(); // Ensure user is authenticated
  const [authenticated, setAuthenticated] = useState(false);


  // Page control
  const [currentPage, setCurrentPage] = useState(0);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const pageSize = 30; // Assuming you want to load 30 transactions per page

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await TransactionService.listTransactions(currentPage, pageSize);
        if (response && response.transactions) {
          setTransactions(response.transactions);
          setTotalTransactions(response.totalTransactions);
        } else {
          setTransactions([]);
          setTotalTransactions(0);
        }
      } catch (error) {
        console.error("Fetching transactions failed: ", error);
        setError(error);
        setTransactions([]);
        setTotalTransactions(0);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, [currentPage, refreshCount]);

    useEffect(() => {
        setAuthenticated(user !== null);
    }, [user]);



  const totalPages = Math.ceil(totalTransactions / pageSize);

  const renderTransactions = () => {
    if (!transactions.length) {
      return <div>No transactions found</div>;
    }
    return transactions.map((transaction) => (
      <div key={transaction.paymentID} className="transaction-item bg-main-day p-6 m-2 w-80 text-main-day rounded-md shadow-md lg:hidden">
        <div className="flex justify-between">
            <p><strong>Name:</strong></p> <p>{transaction.name}</p>
        </div>
        <div className="flex justify-between">
            <p><strong>Email:</strong></p> <p>{transaction.email}</p>
        </div>
        <div className="flex justify-between">
            <p><strong>Plan:</strong></p> <p>{transaction.plan}</p>
        </div>
        <div className="flex justify-between">
            <p><strong>Amount:</strong></p> <p>${transaction.amount.toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
            <p><strong>Status:</strong></p> <p>{transaction.status}</p>
        </div>
        <div className="flex justify-between">
            <p><strong>Date:</strong></p> <p>{new Date(transaction.createdAt).toLocaleDateString()}</p>
        </div>
        <div className='button-container'>
            <button className='general-button smooth-component' onClick={() => handleDelete(transaction.id)}>Delete</button>
        </div>
      </div>
    ));
  };



    // Style to avoid the menu
    const avoidMenu = menuHeight ? { marginTop: menuHeight} : {marginTop: 90};

    //handle search
    const handleSearch = async () => {
        return;
    };

    //handle delete
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this transaction?')) {
            return;
        }
        console.log('Deleting transaction with id: ', id);
        setLoading(true);
        try {
            await TransactionService.deleteTransaction(id);
            setRefreshCount(refreshCount + 1);
        } catch (error) {
            console.error("Error deleting transaction: ", error);
            alert('Error deleting transaction');
        } finally {
            setLoading(false);
        }

    };

  return (
    <div className='min-h-screen bg-two-day text-main-day'>
        <div className="fixed top-0 left-0 w-full"
        style={{zIndex:2}}>
            <NavBar currentPage="Account"/>
        </div>
        {loading && 
        <div className='fixed top-0 left-0 h-screen w-full bg-three-day opacity-85 text-main-day flex justify-center items-center'>
            <Spinner />
        </div>}            
        {!authenticated && <div className='fixed top-0 left-0 h-screen w-full bg-three-day opacity-85 text-main-day flex flex-col justify-center items-center'>You are not yet authenticated, please wait or &nbsp; <a href='/' className=' underline hover:text-blue-500'>return to home</a><Spinner/></div>}
        {error && <div className='h-screen w-full bg-two-day text-main-day flex justify-center items-center'>Error: {error.message}, &nbsp; <a href='/' className=' underline hover:text-blue-500'>return to home</a></div>}
        <div className='flex flex-col items-center'
        style={avoidMenu}>


        {!loading && !error && (
          <>
            <h2 className='text-center text-3xl font-bold py-10'>Manage Transactions</h2>

            <div className='transaction-list hidden lg:flex justify-center lg:flex-col lg:p-4 lg:bg-zinc-100 lg:rounded-md shadow-md my-10 lg:border-2 border-slate-500 w-full'>
            {/* Toolbar for Filters and Search removed for transactions as specified */}

            {/* Search Bar - Consider keeping this if you intend to allow searching through transactions */}
                <div className='w-full flex justify-center px-6 lg:flex flex-col'>
                    <div className=' bg-main-day rounded-md shadow-md p-2 flex justify-center'>
                        <input 
                            type="text" 
                            placeholder="Search transactions..." 
                            onChange={(e) => setSearchValue(e.target.value)} 
                            className='p-2 rounded-md'
                        />
                        <button onClick={handleSearch} className='p-2 bg-slate-300 rounded-md mx-2'>Search</button>
                    </div>
                    {loadingSearch && <div className='h-48 w-full bg-main-day text-main-day flex justify-center items-center'>
                        <Spinner />
                    </div>}

                    {/* Rendering search results or all transactions */}
                    {!loadingSearch && searchedTransactions.length > 0 ? (
                    <table className='table-auto w-full'>
                        <thead>
                        <tr className='text-left'>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Plan</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th> 
                        </tr>
                        </thead>
                        <tbody>
                        {searchedTransactions.map((transaction) => (
                            <tr key={transaction.paymentID} className='hover:bg-neutral-400 smooth-component-300 h-10 shadow-sm'>
                            <td>{transaction.name}</td>
                            <td>{transaction.email}</td>
                            <td>{transaction.plan}</td>
                            <td>${transaction.amount.toFixed(2)}</td>
                            <td>{transaction.status}</td>
                            <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                            <td><button onClick={() => handleDelete(transaction.paymentID)} className='hover:text-red-600 smooth-component-300'>Delete</button></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    ) : null}
                </div>
            </div>


            {/* Search section for small screens, adapted for transactions */}
            <div className='w-full flex justify-center mt-10 px-6 lg:hidden flex-col'>
                <div className=' bg-main-day rounded-md shadow-md p-2 flex justify-center'>
                        <input 
                        type="text" 
                        placeholder="Search transactions..." // Updated placeholder
                        onChange={(e) => setSearchValue(e.target.value)}
                        className='p-2 rounded-md'
                        />
                        <button onClick={handleSearch} className='p-2 bg-slate-300 rounded-md mx-2'>Search</button>
                </div>
                {loadingSearch && <div className='h-48 w-full bg-main-day text-main-day flex justify-center items-center'>
                    <Spinner />
                </div>}

                {!loadingSearch && searchedTransactions.length > 0 ? ( // Update to use searchedTransactions
                    <div className='transaction-list flex flex-wrap justify-center py-6 lg:hidden bg-main-day rounded-md shadow-md mt-6'>
                    <h2 className='w-full text-center'>Search result</h2>
                    {searchedTransactions.map((transaction) => ( // Update to map over searchedTransactions
                        <div key={transaction.paymentID} className="transaction-item bg-main-day p-6 m-2 w-80 text-main-day rounded-md shadow-md">
                            <div className="flex justify-between">
                                <p>Name:</p> <p>{transaction.name}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Email:</p> <p>{transaction.email}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Plan:</p> <p>{transaction.plan}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Amount:</p> <p>${transaction.amount.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Status:</p> <p>{transaction.status}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Date:</p> <p>{new Date(transaction.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className='button-container'>
                                <button className='general-button smooth-component' onClick={() => handleDelete(transaction.paymentID)}>Delete</button>
                            </div>
                        </div>
                    ))}
                    </div>
                ) : null}
            </div>
            <div className='flex flex-wrap justify-center py-10 lg:p-4 lg:bg-zinc-100 lg:rounded-md my-10 lg:border-2 border-slate-500 w-full'>
              {renderTransactions()}
              <table className='hidden bg-zinc-100 lg:table w-full'>
                    <thead className=''>
                    <tr className='text-left'>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Plan</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th> 
                    </tr>
                    </thead>
                    <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.paymentID} className='hover:bg-neutral-400 smooth-component-300 h-10 shadow-sm'>
                        <td>{transaction.name}</td>
                        <td>{transaction.email}</td>
                        <td>{transaction.plan}</td>
                        <td>${transaction.amount.toFixed(2)}</td>
                        <td>{transaction.status}</td>
                        <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                        <td><button onClick={() => handleDelete(transaction.paymentID)} className='hover:text-red-600 smooth-component-300'>Delete</button></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <Pagination 
              totalPages={totalPages} 
              currentPage={currentPage + 1} // Adjusting because currentPage is zero-indexed
              onPageChange={(page) => setCurrentPage(page - 1)}
            />
          </>
        )}
      </div>
    </div>
  );
}
