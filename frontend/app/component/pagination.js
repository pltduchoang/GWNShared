import React from 'react';

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  const windowSize = 5; // Number of pagination links shown at any time
  let startPage = Math.max(1, currentPage - Math.floor(windowSize / 2));
  let endPage = Math.min(totalPages, startPage + windowSize - 1);

  // Adjust the start and end page if near the beginning or end
  if (endPage - startPage + 1 < windowSize) {
    if (currentPage < totalPages / 2) {
      endPage = Math.min(totalPages, endPage + (windowSize - (endPage - startPage)));
    } else {
      startPage = Math.max(1, endPage - (windowSize - 1));
    }
  }

  const pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

  return (
    <div className="pagination w-full flex justify-center">
      <button className='pagination-button' onClick={() => onPageChange(1)} disabled={currentPage === 1}>&#9664;&#9664;</button>
      <button className='pagination-button' onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>&#9664;</button>
      {pages.map(page => (
        <button key={page} onClick={() => onPageChange(page)} className={page === currentPage ? 'pagination-button-active' : 'pagination-button'}>
          {page}
        </button>
      ))}
      <button className='pagination-button' onClick={() => onPageChange(currentPage + 1)} disabled={currentPage >= totalPages}>&#9654;</button>
      <button className='pagination-button' onClick={() => onPageChange(totalPages)} disabled={currentPage >= totalPages}>&#9654;&#9654;</button>
    </div>
  );
};

export default Pagination;
