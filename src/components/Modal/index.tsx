import React, { FC } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isEditMode?: boolean;
  selectedPhoto?: any;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImageChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFormSubmit?: (e: React.FormEvent) => void;
}

const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  isEditMode = false,
  selectedPhoto,
  handleInputChange,
  handleImageChange,
  handleFormSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-md shadow-md max-w-lg w-full">
        <h2 className="text-xl mb-4">{title}</h2>
        {isEditMode ? (
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium">Title</label>
              <input
                name="title"
                type="text"
                value={selectedPhoto?.title || ''}
                onChange={handleInputChange}
                className="border border-gray-300 rounded py-2 px-4 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="border border-gray-300 rounded py-2 px-4 w-full"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {title}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-600 text-white px-4 py-2 rounded ml-2"
              >
                Close
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Title</label>
              <p className="border border-gray-300 rounded py-2 px-4 w-full">{selectedPhoto?.title}</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Image</label>
              <img
                src={selectedPhoto?.url}
                alt={selectedPhoto?.title}
                className="border border-gray-300 rounded w-full"
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;