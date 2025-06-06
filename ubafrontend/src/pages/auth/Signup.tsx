import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { users } from '../../types/userdata';
import InputField from '../../components/common/InputField';
import { useForm } from '../../hooks/useForm';
import type { User } from '../../types/User';

const Signup = () => {
    const { formData, handleChange } = useForm({
        fname: '',
        lname: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (users.some(user => user.email === formData.email)) {
            setError('Email already registered');
            return;
        }

        const newUser: User = {
            id: users.length + 1,
            fname: formData.fname,
            lname: formData.lname,
            email: formData.email,
            password: formData.password
        };

        users.push(newUser);
        console.log('User registered:', newUser);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg relative z-20">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                        Register
                    </h2>
                </div>
                {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <InputField
                            label="First Name"
                            type="text"
                            value={formData.fname}
                            onChange={handleChange}
                            placeholder="Enter your first name"
                            required
                            data-testid="first name"
                            name="fname"
                        />
                        <InputField
                            label="Last Name"
                            type="text"
                            value={formData.lname}
                            onChange={handleChange}
                            placeholder="Enter your last name"
                            required
                            data-testid="last name"
                            name="lname"
                        />
                        <InputField
                            label="Email address"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            autoComplete="email"
                            data-testid="email address"
                            name="email"
                        />
                        <InputField
                            label="Password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            required
                            autoComplete="new-password"
                            data-testid="password"
                            name="password"
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#5F69FB] hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Register
                        </button>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <a href="/" className="font-medium text-indigo-400 hover:text-indigo-500 ml-1">
                                Login
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;
