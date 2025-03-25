// tests/controllers/adminController.test.js

// Mock des dépendances avec des chemins directs
jest.mock("../../server/config/db", () => ({
  Admin: {
    findOne: jest.fn(),
  },
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

// Importations après les mocks
const { loginAdmin } = require("../../server/controllers/adminController");
const jwt = require("jsonwebtoken");
const db = require("../../server/config/db");

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
      headers: {
        "content-type": "application/json",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("devrait renvoyer une erreur lorsque l'email n'existe pas", async () => {
    // Configurer le mock pour simuler qu'aucun admin n'est trouvé
    db.Admin.findOne.mockResolvedValue(null);

    // Appeler la fonction à tester
    await loginAdmin(req, res);

    // Vérifier les attentes
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Email ou mot de passe incorrect",
      })
    );
  });

  test("devrait renvoyer une erreur lorsque le mot de passe est incorrect", async () => {
    // Configurer le mock pour simuler un admin trouvé mais avec un mot de passe différent
    db.Admin.findOne.mockResolvedValue({
      id_admin: 1,
      email: "admin@example.com",
      nom: "Admin",
      mdp: "motdepassedifferent",
    });

    // Appeler la fonction à tester
    await loginAdmin(req, res);

    // Vérifier les attentes
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Email ou mot de passe incorrect",
      })
    );
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

    // Vérifier que jwt.sign a été appelé avec les bons arguments
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: admin.id_admin, email: admin.email, isAdmin: true },
      expect.any(String),
      { expiresIn: "1d" }
    );

    // Vérifier que la fonction a renvoyé le bon statut et la bonne réponse
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Connexion admin réussie",
        token: mockToken,
        admin: expect.objectContaining({
          id: admin.id_admin,
          nom: admin.nom,
          email: admin.email,
        }),
      })
    );
  });

  test("devrait gérer les erreurs et renvoyer une erreur 500", async () => {
    // Configurer le mock pour simuler une erreur
    const errorMessage = "Erreur de base de données";
    db.Admin.findOne.mockRejectedValue(new Error(errorMessage));

    // Appeler la fonction à tester
    await loginAdmin(req, res);

    // Vérifier que la fonction a renvoyé le statut 500
    expect(res.status).toHaveBeenCalledWith(500);
    // Ajuster l'attente pour ne pas inclure la propriété details si elle n'existe pas
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Erreur serveur",
      })
    );
    expect(console.error).toHaveBeenCalled();
  });
});
