import React, { FC, useState } from "react";
import useSWR from "swr";
import { Photo } from "@/types/cardtype";
import { FaTrash, FaEdit, FaEye } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Modal from "@/components/Modal"; 

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const Table: FC = () => {
  const { data, error, mutate } = useSWR<Photo[]>("http://localhost:3003/photos", fetcher);

  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const itemsPerPage = 5;

  if (error) return <div>Error loading data</div>;
  if (!data) return <div>Loading...</div>;

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:3003/photos/${id}`, {
      method: 'DELETE',
    });

    mutate(data.filter(item => item.id !== id), false);
  };

  const handleView = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsViewModalOpen(true);
  };

  const handleEdit = (photo: Photo) => {
    setSelectedPhoto(photo);
    setIsEditMode(true);
    setIsCreateMode(false);
    setIsEditModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedPhoto({ title: "", url: "", albumId: 1, id: data.length + 1 }); 
    setIsCreateMode(true);
    setIsEditMode(false);
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedPhoto(null);
    setImageFile(null); 
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPhoto?.title || (!selectedPhoto?.url && !imageFile)) {
      toast.error("Please fill out all required fields");
      return;
    }

    let uploadedImageUrl = selectedPhoto?.url;

    if (imageFile) {
      const formData = new FormData();
      formData.append("file", imageFile);
      const response = await fetch('http://localhost:3003/upload', { 
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        uploadedImageUrl = data.url; 
      } else {
        console.error("Failed to upload image");
      }
    }

    if (selectedPhoto) {
      const method = isCreateMode ? 'POST' : 'PUT';
      const url = isCreateMode
        ? `http://localhost:3003/photos`
        : `http://localhost:3003/photos/${selectedPhoto.id}`;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...selectedPhoto, url: uploadedImageUrl }),
      });

      if (response.ok) {
        const updatedData = await response.json();

        if (isCreateMode) {
          mutate([...data, updatedData], false); 
          setCurrentPage(Math.ceil((data.length + 1) / itemsPerPage)); 
        } else {
          mutate(
            data.map(item => (item.id === selectedPhoto.id ? updatedData : item)),
            false
          );
        }

        setIsEditModalOpen(false);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPhoto({ ...selectedPhoto!, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleClickPage = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="table-container bg-white p-4 shadow-md rounded-md">
      <ToastContainer />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <button 
          className="bg-blue-600 text-white py-2 px-4 rounded mb-4 sm:mb-0"
          onClick={handleCreate}
        >
          + Create
        </button>
        <input 
          type="text" 
          placeholder="Search Project" 
          className="border border-gray-300 rounded py-2 px-4 w-full sm:w-auto"
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>
      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left">
          <thead>
            <tr>
              <th>Project Name</th>
              <th className="hidden md:table-cell">Description</th>
              <th>Team</th>
              <th className="hidden md:table-cell">Assigned Date</th>
              <th className="hidden md:table-cell">Due Date</th>
              <th>Status</th>
              <th className="hidden md:table-cell">Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="flex items-center space-x-4 py-2">
                  <img className="w-12 h-12 rounded-full" src={item.url} alt={item.title} />
                  <div>
                    <h2 className="font-semibold text-sm sm:text-base">{item.title}</h2>
                    <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Total 18/22 tasks completed</p>
                  </div>
                </td>
                <td className="hidden md:table-cell">{item.title}</td>
                <td>
                  <div className="flex items-center space-x-2">
                    <img className="w-8 h-8 rounded-full" src="https://spruko.com/demo/xintra/dist/assets/images/faces/6.jpg" alt="Team member 1" />
                    <img className="w-8 h-8 rounded-full" src="https://spruko.com/demo/xintra/dist/assets/images/faces/7.jpg" alt="Team member 2" />
                  </div>
                </td>
                <td className="hidden md:table-cell">15, Jun 2024</td>
                <td className="hidden md:table-cell">30, Aug 2024</td>
                <td>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                    <span className="text-blue-600 text-sm sm:text-base">65% Completed</span>
                    <div className="w-full sm:w-24 h-2 bg-gray-200 rounded">
                      <div className="h-2 bg-blue-600 rounded" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </td>
                <td className="hidden md:table-cell"><span className="text-yellow-500">Medium</span></td>
                <td className="flex space-x-2">
                  <FaEye className="text-yellow-500 cursor-pointer" onClick={() => handleView(item)} />
                  <FaEdit className="text-violet-500 cursor-pointer" onClick={() => handleEdit(item)} />
                  <FaTrash className="text-red-500 cursor-pointer" onClick={() => handleDelete(item.id!)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handleClickPage(i + 1)}
            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-gray-600 text-white' : 'bg-white text-black border border-gray-300'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        title={isCreateMode ? 'Add' : 'Edit Project'}
        isEditMode={true} 
        selectedPhoto={selectedPhoto}
        handleInputChange={handleInputChange}
        handleImageChange={handleImageChange}
        handleFormSubmit={handleFormSubmit}
      />

      <Modal
        isOpen={isViewModalOpen}
        onClose={handleModalClose}
        title="View Project"
        selectedPhoto={selectedPhoto}
      />
    </div>
  );
};
