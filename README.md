# PS5 Reservation Mini Program

PS5 Reservation is a lightweight WeChat mini program that lets customers reserve a PS5 timeslot, submit payment proof, and track their order status. Administrators can review payment evidence, confirm or reject orders, and configure core business settings. The project targets a minimal, single-console deployment without high-availability requirements.

## Repository layout

The repository is split into independent frontend and backend workspaces. Only the frontend skeleton is available at the moment – a Go (Gin) backend will be added later.

```
.
├── README.md                # Project overview and contribution guide
└── frontend/                # Uni-App (Vue 3) mini program implementation
    ├── package.json         # Frontend dependencies and scripts
    ├── vite.config.js       # Vite + Uni-App build configuration
    └── src/
        ├── App.vue          # Root component
        ├── main.js          # Application bootstrap with Pinia
        ├── manifest.json    # Uni-App manifest (mini program target)
        ├── pages.json       # Page and tab configuration
        ├── components/      # Shared UI components (slot grid, countdown, etc.)
        ├── pages/           # Route-aligned page views
        ├── services/        # HTTP client and REST API wrappers
        ├── store/           # Pinia stores (auth, slots, orders)
        ├── utils/           # Time helpers, toast helpers
        └── uni.scss         # Global styles and design tokens
```

## Frontend (Uni-App, Vue 3)

The frontend follows the flow defined in the MVP requirements:

1. WeChat login (wx.login) – handled via a dedicated auth store and backend-issued JWT tokens.
2. 72-hour slot selection – rounded to the next whole hour with conflict checks.
3. Order creation and payment guidance – static QR code, countdown, and remark hints.
4. Payment proof upload – up to three images (≤5 MB each) with note/remark support.
5. Order management – list, detail view, and allowed actions based on order state.
6. Administrator functionality (web) will be implemented separately once the backend scaffold is available.

### Getting started

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Run the mini program in WeChat developer mode:
   ```bash
   npm run dev:mp-weixin
   ```
3. Build for production:
   ```bash
   npm run build:mp-weixin
   ```

Refer to `frontend/README.md` (to be added later) for platform-specific configuration such as AppID, request domains, and environment variables.

## Backend (Go + Gin, forthcoming)

The backend service will expose REST APIs for authentication, slot management, order workflows, administrator verification, and configuration settings. Once the scaffolding is provided, the repository will include:

- Go module with Gin HTTP server and MySQL integration.
- Database migrations covering users, reservations, orders, payment proofs, admins, and settings tables.
- Scheduled task to expire orders that pass their hold period.
- JWT-based authentication for both user and admin clients.

## Contributing

1. Fork the repository and clone your fork.
2. Use feature branches for development.
3. Run linting and automated checks before submitting pull requests.
4. Follow the product requirements and development guidelines in the shared documentation.

## License

This project is released under the MIT License. See `LICENSE` (to be added) for details.
