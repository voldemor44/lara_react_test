<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\SignupRequest;
use App\Models\User;
use Illuminate\Auth\Events\Login;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{

    public function signup(SignupRequest $request)
    {
        // Recupération et validation des données de la requête
        $data = $request->validated();

        // Création de l'utilisateur
        $user = User::create([
            "name" => $data["name"],
            "email" => $data["email"],
            "password" => bcrypt($data["password"])
        ]);

        // Génération du token
        $token = $user->createToken("main")->plainTextToken;

        return response(compact('user', 'token'));
    }

    public function login(LoginRequest $request)
    {
        $credentials = $request->validated(); // Contient le nom et le password de l'utilisateur

        // Vérification de l'existence du user
        if (!Auth::attempt($credentials)) {
            return response(["message" => "Provider email address or password is incorrect "]);
        }

        // Authentification de l'utilisateur
        /** @var User $user */
        $user = Auth::user();

        // Génération du token
        $token = $user->createToken("main")->plainTextToken;

        return response(compact('user', 'token'));
    }

    public function logout(Request $request)
    {
        /** @var User $user */
        $user = $request->user();
        $user->currentAccessToken()->delete();
        return response('', 204);
    }
}
