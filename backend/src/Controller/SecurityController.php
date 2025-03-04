<?

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Security\LoginFormAuthenticator;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Authentication\Token\UsernamePasswordToken;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Http\Authenticator\AbstractAuthenticator;
use Symfony\Component\Security\Http\Authenticator\AuthenticatorInterface;

class SecurityController extends AbstractController
{
    private $userRepository;
    private $passwordEncoder;

    public function __construct(UserRepository $userRepository, UserPasswordEncoderInterface $passwordEncoder)
    {
        $this->userRepository = $userRepository;
        $this->passwordEncoder = $passwordEncoder;
    }

    #[Route('/login', name: 'app_login', methods: ['POST'])]
    public function login(Request $request, LoginFormAuthenticator $loginFormAuthenticator, Security $security): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $mail = $data['mail'];
        $password = $data['mdp'];

        // Chercher l'utilisateur par email
        $user = $this->userRepository->findOneBy(['mail' => $mail]);

        if (!$user || !$this->passwordEncoder->isPasswordValid($user, $mdp)) {
            return new JsonResponse(['error' => 'Invalid credentials'], Response::HTTP_UNAUTHORIZED);
        }

        // Créer un token de sécurité pour l'utilisateur
        $token = new UsernamePasswordToken($user, null, 'main', $user->getRoles());

        // On connecte l'utilisateur
        $this->get('security.token_storage')->setToken($token);
        $this->get('session')->set('_security_main', serialize($token));

        // Générer le cookie avec le token
        $response = new JsonResponse(['message' => 'Connected successfully']);
        $response->headers->setCookie(cookie: new \Symfony\Component\HttpFoundation\Cookie('AUTH_TOKEN', $token->getCredentials(), time() + 3600, '/', null, false, true));

        return $response;
    }

    #[Route('/logout', name: 'app_logout')]
    public function logout(): void
    {
        // Symfony gère le logout automatiquement
    }
}
