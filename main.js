// Gửi yêu cầu đăng nhập khi nhấn nút "Login"
document.querySelector('.btn-login').addEventListener('click', async () => {
    try {
        var emailError = document.getElementById('emailError');
        var passwordError = document.getElementById('passwordError');
        var isValid = true;
        const email = document.getElementById('login_email').value;
        const password = document.getElementById('login_password').value;
        console.log(email, " ", password)

        // Kiểm tra định dạng email
        if (!isValidEmail(email)) {
            emailError.textContent = "Email must be in correct format";
            isValid = false;
        } else {
            emailError.textContent = "";

        }

        // Kiểm tra mật khẩu phải lớn hơn 8 kí tự
        if (!isValidPassword(password)) {
            passwordError.textContent = "Password must be greater than 8 characters";
            isValid = false;
        } else {
            passwordError.textContent = "";
        }

        if (isValid) {
            const formData = {
                login: email,
                password: password
            };
            // Gửi yêu cầu POST tới API
            const response = await fetch(' https://recruitment-api.pyt1.stg.jmr.pl/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            // Kiểm tra phản hồi từ API
            if (response.ok) {
                const data = await response.json();
                // Xử lý phản hồi thành công
                console.log(data.message);
                if (data.status === "ok") {
                    localStorage.setItem('user', JSON.stringify(formData));
                    window.location.href = 'task.html';
                } else {
                    // emailError.textContent = "Invalid Email or Password";
                    passwordError.textContent = "Invalid Email or Password";

                }
            } else {
                // Xử lý phản hồi lỗi
                console.error('Login failed');
            }
        }

    } catch (error) {
        // Xử lý lỗi nếu có
        console.error(error);
    }
});

// Hàm kiểm tra định dạng email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Hàm kiểm tra mật khẩu phải lớn hơn 8 kí tự
function isValidPassword(password) {
    const passwordRegex = /^.{8,}$/;
    return passwordRegex.test(password);
}

document.addEventListener('DOMContentLoaded', function () {
    // Kiểm tra xem localStorage có thông tin user không
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        // Nếu có, chuyển hướng người dùng đến trang task.html
        window.location.href = 'task.html';
    }
});