<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * Fungsi untuk mendaftarkan pengguna baru.
     */
    public function register(Request $request)
    {
        // 1. Validasi Input
        // Kita memastikan bahwa data yang dikirim oleh frontend sesuai dengan yang kita harapkan.
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        // Jika validasi gagal, kirim respon error 422 (Unprocessable Entity)
        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 2. Buat Pengguna Baru
        // Jika validasi berhasil, kita buat entri baru di tabel 'users'.
        // Password di-hash (dienkripsi) demi keamanan.
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // 3. Kirim Respon Sukses
        // Kita kirim kembali data pengguna yang baru dibuat dengan status 201 (Created).
        return response()->json([
            'message' => 'User registered successfully',
            'user' => $user
        ], 201);
    }

    /**
     * Fungsi untuk login pengguna.
     */
    public function login(Request $request)
    {
        // 1. Validasi Input
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // 2. Coba Otentikasi
        // Kita mencoba mencocokkan email dan password yang diberikan dengan data di database.
        if (!Auth::attempt($request->only('email', 'password'))) {
            // Jika tidak cocok, kirim respon error 401 (Unauthorized).
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // 3. Buat Token API
        // Jika otentikasi berhasil, kita ambil data pengguna dan buatkan token API
        // menggunakan Sanctum. Token inilah yang akan digunakan oleh frontend
        // untuk mengakses rute-rute yang dilindungi.
        $user = User::where('email', $request->email)->firstOrFail();
        $token = $user->createToken('auth_token')->plainTextToken;

        // 4. Kirim Respon Sukses
        // Kita kirim kembali data pengguna dan tokennya.
        return response()->json([
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    /**
     * Fungsi untuk logout pengguna.
     */
    public function logout(Request $request)
    {
        // Hapus token API yang sedang digunakan untuk otentikasi.
        // Ini adalah cara yang aman untuk memastikan token tidak bisa digunakan lagi.
        $request->user()->currentAccessToken()->delete();

        // Kirim respon sukses.
        return response()->json([
            'success' => true,
            'message' => 'Successfully logged out',
        ], 200);
    }
}
