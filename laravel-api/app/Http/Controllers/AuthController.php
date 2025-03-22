<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    // User registration function
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Create a new user
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Generate a token for the newly registered user
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return the access token with a success message
        return response()->json([
            'message' => 'User registered successfully!',
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
}

    // User login function
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Attempt to log the user in
        if (!Auth::attempt($validated)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Get the authenticated user
        $user = Auth::user();

        // Generate a new token for the user
        $token = $user->createToken('auth_token')->plainTextToken;

        // Return the access token
        return response()->json([
            'message' => 'Login successful!',
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 200);
    }
    // User logout function
    public function logout(Request $request)
    {
        // Check if the user is authenticated
        if ($request->user()) {
            // Revoke the user's current token
            $request->user()->currentAccessToken()->delete();
    
            // Return a success message
            return response()->json([
                'message' => 'Logged out successfully!',
            ], 200);
        }
    
        // Return an error if user is not authenticated
        return response()->json([
            'message' => 'Not authenticated.',
        ], 401);
    }
    
    // Function to get authenticated user details
    public function getUser(Request $request)
    {
        // Return the authenticated user's details
        return response()->json($request->user(), 200);
    }
    // Function to delete the authenticated user
    public function deleteUser(Request $request)
    {
        $user = $request->user();

        // Revoke all tokens associated with the user
        $user->tokens()->delete();

        // Delete the user from the database
        $user->delete();

        // Return a success message
        return response()->json([
            'message' => 'User deleted successfully!',
        ], 200);
    }
}
