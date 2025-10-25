import React, { useState } from 'react';
import Modal from './Modal';

const DummyPlayer: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div 
        className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg shadow-black/50 flex flex-col justify-center items-center text-center p-4 cursor-pointer group"
        onClick={openModal}
        aria-label="Buka pemutar video"
        role="button"
        tabIndex={0}
      >
        <div className="w-24 h-24 rounded-full bg-gray-800/50 flex items-center justify-center transition-all duration-300 group-hover:bg-[#00ffc6]/20 group-hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500 transition-colors group-hover:text-[#00ffc6]" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
          </svg>
        </div>
        <p className="text-gray-500 mt-4 font-semibold select-none">Tekan untuk memutar</p>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#00ffc6]/20 mb-4">
                <svg className="h-6 w-6 text-[#00ffc6]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
          <h3 className="text-lg leading-6 font-medium text-white" id="modal-title">
            Video Menyusul!
          </h3>
          <div className="mt-2 px-7 py-3">
            <p className="text-sm text-gray-400">
              Heker yuki kurang dana hehe
            </p>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              className="px-4 py-2 bg-[#00ffc6] text-gray-900 font-semibold rounded-md w-full shadow-sm hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00ffc6] focus:ring-offset-gray-800"
              onClick={closeModal}
            >
              Oke, Saya Paham
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DummyPlayer;