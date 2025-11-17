var databaseURL = "https://company-directory-ed369-default-rtdb.asia-southeast1.firebasedatabase.app";

document.addEventListener('DOMContentLoaded', function() {
    // Get edit index from URL
    var urlParams = new URLSearchParams(window.location.search);
    var editIndex = urlParams.get('index');

    if (!editIndex) {
        alert('No company selected for editing');
        window.location.href = 'index.html';
        return;
    }

    // Load company data
    fetch(databaseURL + "/companies.json")
        .then(function(response) { return response.json(); })
        .then(function(data) {
            if (!data) {
                alert('No companies found');
                window.location.href = 'index.html';
                return;
            }

            var companies = Object.values(data);
            var company = companies[editIndex];

            if (!company) {
                alert('Company not found');
                window.location.href = 'index.html';
                return;
            }

            // Fill form with company data
            document.getElementById('companyName').value = company.name || '';
            document.getElementById('personName').value = company.personName || '';
            document.getElementById('designation').value = company.designation || '';
            document.getElementById('email').value = company.email || '';
            document.getElementById('phone').value = company.phone || '';
            document.getElementById('website').value = company.website || '';
            document.getElementById('address').value = company.address || '';
        })
        .catch(function(error) {
            alert('Error loading company: ' + error.message);
            window.location.href = 'index.html';
        });

    // Handle form submission
    var form = document.getElementById('editForm');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        var companyName = document.getElementById('companyName').value.trim();
        var personName = document.getElementById('personName').value.trim();
        var designation = document.getElementById('designation').value.trim();
        var email = document.getElementById('email').value.trim();
        var phone = document.getElementById('phone').value.trim();
        var website = document.getElementById('website').value.trim();
        var address = document.getElementById('address').value.trim();

        if (!companyName || !personName || !designation || !email || !phone || !website || !address) {
            alert("All fields are required!");
            return;
        }

        // Validate email
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Invalid email address!");
            return;
        }

        // Validate website
        try {
            new URL(website);
        } catch {
            alert("Invalid website URL");
            return;
        }

        var updatedCompany = {
            name: companyName,
            personName: personName,
            designation: designation,
            email: email,
            phone: phone,
            website: website,
            address: address
        };

        // Update company in Firebase
        fetch(databaseURL + "/companies.json")
            .then(function(response) { return response.json(); })
            .then(function(data) {
                var companies = Object.values(data);
                companies[editIndex] = updatedCompany;

                var companiesObj = {};
                companies.forEach(function(c, idx) {
                    companiesObj[idx] = c;
                });

                return fetch(databaseURL + "/companies.json", {
                    method: "PUT",
                    body: JSON.stringify(companiesObj)
                });
            })
            .then(function(response) {
                if (!response.ok) throw new Error("Update failed");
                alert("✅ Company updated!");
                window.location.href = 'index.html';
            })
            .catch(function(error) {
                alert("Error: " + error.message);
                console.error(error);
            });
    });
});