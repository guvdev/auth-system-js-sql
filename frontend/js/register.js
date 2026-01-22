const form = document.querySelector("form");
const back = document.querySelector("#back");


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.querySelector("#name").value;
    const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;

    try {
        const response = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        // Configura o toast
        toast.textContent = data.message;
        if (data.success) {
            toast.classList.remove('bg-red-500');
            toast.classList.add('bg-green-500');
        } else {
            toast.classList.remove('bg-green-500');
            toast.classList.add('bg-red-500');
        }

        // Mostra o toast
        toast.classList.remove('opacity-0');
        toast.classList.add('opacity-100');

        // Esconde o toast depois de 3 segundos
        setTimeout(() => {
            toast.classList.remove('opacity-100');
            toast.classList.add('opacity-0');
        }, 3000);


        if (data.success) {
            setTimeout(() => {
                window.location.href = "login.html";
            }, 2000);
        }
    } catch (error) {
        toast.textContent = 'Erro de conexão com o servidor';
        toast.classList.remove('opacity-0', 'bg-green-500');
        toast.classList.add('opacity-100', 'bg-red-500');

        setTimeout(() => {
            toast.classList.remove('opacity-100');
            toast.classList.add('opacity-0');
        }, 3000);
    }
});

back.addEventListener("click", () => {
    window.location.href = "login.html";
});