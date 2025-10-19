<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    // Method for user registration
    public function register(Request $request)
    {
        // Manually create a validator to handle registration data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users', // Must be a unique email in the users table
            'password' => [
                'required',
                'confirmed', // Must match the password_confirmation field
                Password::min(8) // Use Laravel's built-in password rule for strong password requirements
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
                    ->uncompromised(), // Checks if the password has been exposed in a data breach
            ],
        ], [
            'email.unique' => 'Email sudah digunakan, Login atau mendaftar menggunakan akun lain', // Custom error message
        ]);

        // If validation fails, return a 422 Unprocessable Entity response with error details
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Create a new user with the validated data
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password), // Hash the password for security
        ]);

        // Return a success message and the new user data with a 201 Created status
        return response()->json([
            'message' => 'User successfully registered',
            'user' => $user
        ], 201);
    }

    // Method for user login
    public function login(Request $request)
    {
        // Basic validation for login credentials
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Attempt to authenticate the user with the provided credentials
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Unauthorized'], 401); // If authentication fails, return a 401 Unauthorized response
        }

        // Find the authenticated user
        $user = User::where('email', $request['email'])->firstOrFail();

        // Create a new Sanctum API token for the user
        $token = $user->createToken('api-token')->plainTextToken;

        // Return a success message, the API token, and user data
        return response()->json([
            'message' => 'Hi '.$user->name.', welcome back',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    // Method for user logout
    public function logout(Request $request)
    {
        // Revoke the current user's access token
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Successfully logged out']);
    }
}

// backend\app\Http\Controllers\Api\AuthController.php