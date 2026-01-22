const cadastrar = document.querySelector("#cadastrar");
const form = document.querySelector("form");
const regain = document.querySelector("#regain");

cadastrar.addEventListener("click", () => {
  window.location.href = "register.html";
});

regain.addEventListener("click", () => {
  toast.textContent = 'Funcionalidade em desenvolvimento';
  toast.classList.remove('bg-green-500', 'bg-red-500');
  toast.classList.add('bg-yellow-400');
  toast.classList.remove('opacity-0');
  toast.classList.add('opacity-100');
  setTimeout(() => {
    toast.classList.remove('opacity-100');
    toast.classList.add('opacity-0');
  }, 3000);
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    toast.textContent = data.message;
    toast.classList.remove('opacity-0');
    toast.classList.add('opacity-100');
    setTimeout(() => {
      toast.classList.remove('opacity-100');
      toast.classList.add('opacity-0');
    }, 3000);
    if (data.success) {
      toast.classList.remove('bg-red-500');
      toast.classList.add('bg-green-500');
      setTimeout(() => {
        window.location.href = "dashboard.html";
      }, 2000);
    } else {
      toast.classList.remove('bg-green-500');
      toast.classList.add('bg-red-500');
    }
  } catch (err) {
    toast.textContent = 'Erro de conexão com o servidor';
    toast.classList.remove('opacity-0', 'bg-green-500');
    toast.classList.add('opacity-100', 'bg-red-500');

    setTimeout(() => {
      toast.classList.remove('opacity-100');
      toast.classList.add('opacity-0');
    }, 3000);
  }
});

// resumo do codigo acima:
// 1. Captura o evento de submit do form
// 2. Previne o comportamento padrão (recarregar a página)