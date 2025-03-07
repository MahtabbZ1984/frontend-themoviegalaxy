import React, { useState } from 'react';

const ReviewSidebar = ({ onSubmit, onClose }) => {
    const [reviewContent, setReviewContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(reviewContent);
        setReviewContent('');
        onClose();
    };

    return (
        <div className="fixed right-0 top-0 h-full w-full sm:w-1/2 lg:w-1/4 bg-transparent p-4">
            <h2 className=" text-white text-xl font-bold mb-2">Add Your Review</h2>
            <form onSubmit={handleSubmit} className=' text-black'>
                <textarea
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    rows="20"
                    className="w-full border rounded p-2 bg-gray-700 text-black"
                    placeholder="Write your review here..."
                    required
                />
                <div className="flex justify-end mt-2 ">
                    <button type="button" onClick={onClose} className="mr-2 bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Submit</button>
                </div>
            </form>
        </div>
    );
};

export default ReviewSidebar;