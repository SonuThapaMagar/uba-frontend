import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../layouts/dashboardLayout";
import { showToast } from "../../utils/toast";
import { TOAST_MESSAGES } from "../../constants/constant";
import { graphQLRequest } from "../../utils/api";
import { GET_USERS, DELETE_USER } from "../../utils/queries";

const DeleteUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await graphQLRequest(GET_USERS);
        if (response?.users) {
          const foundUser = response.users.find((u: any) => u.id === id);
          if (foundUser) {
            setUser(foundUser);
          } else {
            showToast.error(TOAST_MESSAGES.USER_NOT_FOUND);
            navigate("/users");
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        showToast.error(TOAST_MESSAGES.USER_UPDATE_ERROR);
      }
    };
    fetchUser();
  }, [id, navigate]);

  const handleDelete = async () => {
    try {
      await graphQLRequest(DELETE_USER, { id });
      showToast.success(TOAST_MESSAGES.USER_DELETED);
      navigate("/users");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      showToast.error(TOAST_MESSAGES.USER_DELETE_ERROR);
    }
  };

  const handleCancel = () => {
    navigate("/users");
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Confirm Delete</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this user?
                </p>
                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                  <p className="font-medium">
                    Name: {user.fname} {user.lname}
                  </p>
                  <p className="text-gray-600">Email: {user.email}</p>
                </div>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  data-testid="delete-button"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  data-testid="cancel-button"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DeleteUser;
