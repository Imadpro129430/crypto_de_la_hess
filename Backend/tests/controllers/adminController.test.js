// tests/adminController.test.js
const { loginAdmin } = require("@/controllers/adminController");
const db = require("@/config/db");
const jwt = require("jsonwebtoken");

// Mock des dépendances
jest.mock("@/config/db", () => ({
  Admin: {
    findOne: jest.fn(),
  },
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

// Configuration pour éviter l'erreur console is not defined
global.console = {
  log: jest.fn(),
  error: jest.fn(),
};

describe("Admin Controller - loginAdmin", () => {
  let req;
  let res;

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks();

    // Mock de req et res pour simuler la requête et la réponse HTTP
    req = {
      body: {
        email: "admin@example.com",
        password: "admin123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("devrait renvoyer une erreur 400 si l'email n'existe pas", async () => {
    // Configurer le mock pour simuler qu'aucun admin n'est trouvé
    db.Admin.findOne.mockResolvedValue(null);

    // Appeler la fonction à tester
    await loginAdmin(req, res);

    // Vérifier que la fonction a renvoyé le statut et le message attendus
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email ou mot de passe incorrect",
    });
  });

  test("devrait renvoyer une erreur 400 si le mot de passe est incorrect", async () => {
    // Configurer le mock pour simuler un admin trouvé mais avec un mot de passe différent
    db.Admin.findOne.mockResolvedValue({
      id_admin: 1,
      email: "admin@example.com",
      nom: "Admin",
      mdp: "motdepassedifferent",
    });

    // Appeler la fonction à tester
    await loginAdmin(req, res);

    // Vérifier que la fonction a renvoyé le statut et le message attendus
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Email ou mot de passe incorrect",
    });
  });

  test("devrait connecter l'admin et renvoyer un token si les identifiants sont corrects", async () => {
    // Configurer les mocks pour simuler une connexion réussie
    const admin = {
      id_admin: 1,
      email: "admin@example.com",
      nom: "Admin",
      mdp: "admin123",
    };

    db.Admin.findOne.mockResolvedValue(admin);

    const mockToken = "jwt-token-mock";
    jwt.sign.mockReturnValue(mockToken);

    // Appeler la fonction à tester
    await loginAdmin(req, res);

    // Vérifier que le JWT a été signé avec les bonnes informations
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: admin.id_admin, email: admin.email, isAdmin: true },
      expect.any(String),
      { expiresIn: "1d" }
    );

    // Vérifier que la fonction a renvoyé le statut et la réponse attendus
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Connexion admin réussie",
      token: mockToken,
      admin: {
        id: admin.id_admin,
        nom: admin.nom,
        email: admin.email,
      },
    });
  });

  test("devrait gérer les erreurs et renvoyer une erreur 500", async () => {
    // Configurer le mock pour simuler une erreur
    const errorMessage = "Erreur de base de données";
    db.Admin.findOne.mockRejectedValue(new Error(errorMessage));

    // Appeler la fonction à tester
    await loginAdmin(req, res);

    // Vérifier que la fonction a renvoyé le statut et le message attendus
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Erreur serveur",
      details: expect.any(String),
    });
    expect(console.error).toHaveBeenCalled();
  });
});
