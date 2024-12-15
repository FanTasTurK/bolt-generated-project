document.addEventListener('DOMContentLoaded', () => {
      const teamsTab = document.querySelector('.tab-link[data-tab="teams"]');
      const statisticsTab = document.querySelector('.tab-link[data-tab="statistics"]');
      const compareTab = document.querySelector('.tab-link[data-tab="compare"]');

      teamsTab.addEventListener('click', () => switchTab('teams'));
      statisticsTab.addEventListener('click', () => switchTab('statistics'));
      compareTab.addEventListener('click', () => switchTab('compare'));

      fetch('data.csv')
        .then(response => response.text())
        .then(data => {
          const rows = data.split('\n');
          const headers = rows[0].split(',');
          const teams = new Set();

          for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(',');
            if (row.length === headers.length) {
              teams.add(row[headers.indexOf('Team')]);
            }
          }

          const teamList = document.getElementById('team-list');
          teams.forEach(team => {
            const li = document.createElement('li');
            li.textContent = team;
            li.addEventListener('click', () => showTeamStats(team));
            teamList.appendChild(li);
          });

          const teamSelect1 = document.getElementById('team-select-1');
          const teamSelect2 = document.getElementById('team-select-2');

          teams.forEach(team => {
            const option1 = document.createElement('option');
            option1.value = team;
            option1.textContent = team;
            teamSelect1.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = team;
            option2.textContent = team;
            teamSelect2.appendChild(option2);
          });
        })
        .catch(error => console.error('Error fetching data:', error));
    });

    function switchTab(tabName) {
      const tabs = document.querySelectorAll('.tab-link');
      const contents = document.querySelectorAll('.tab-content');

      tabs.forEach(tab => tab.classList.remove('current'));
      contents.forEach(content => content.classList.remove('current'));

      document.querySelector(`.tab-link[data-tab="${tabName}"]`).classList.add('current');
      document.getElementById(tabName).classList.add('current');
    }

    function showTeamStats(team) {
      fetch('data.csv')
        .then(response => response.text())
        .then(data => {
          const rows = data.split('\n');
          const headers = rows[0].split(',');
          const teamData = {};

          for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(',');
            if (row.length === headers.length && row[headers.indexOf('Team')] === team) {
              headers.forEach((header, index) => {
                teamData[header] = row[index];
              });
              break;
            }
          }

          const teamStats = document.getElementById('team-stats');
          teamStats.innerHTML = `
            <h3>${team}</h3>
            ${Object.entries(teamData).map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`).join('')}
          `;
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    function compareTeams() {
      const team1 = document.getElementById('team-select-1').value;
      const team2 = document.getElementById('team-select-2').value;

      fetch('data.csv')
        .then(response => response.text())
        .then(data => {
          const rows = data.split('\n');
          const headers = rows[0].split(',');
          const teamData1 = {};
          const teamData2 = {};

          for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(',');
            if (row.length === headers.length) {
              if (row[headers.indexOf('Team')] === team1) {
                headers.forEach((header, index) => {
                  teamData1[header] = row[index];
                });
              }
              if (row[headers.indexOf('Team')] === team2) {
                headers.forEach((header, index) => {
                  teamData2[header] = row[index];
                });
              }
            }
          }

          const comparisonResult = document.getElementById('comparison-result');
          comparisonResult.innerHTML = `
            <h3>Comparison: ${team1} vs ${team2}</h3>
            ${Object.entries(teamData1).map(([key, value]) => `<p><strong>${key}:</strong> ${value} (Team 1) - ${teamData2[key]} (Team 2)</p>`).join('')}
          `;
        })
        .catch(error => console.error('Error fetching data:', error));
    }
