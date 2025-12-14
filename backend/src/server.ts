import app from "./app";
import { createDefaultAdmin } from "./seed/admin.seed";

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await createDefaultAdmin();
});
