$(document).ready(function () {
  const items = [
    { id: 1, title: "Item Title 1", status: "Open", bid: 100 },
    { id: 2, title: "Item Title 2", status: "Closing Soon", bid: 200 },
    { id: 3, title: "Item Title 3", status: "Closing Soon", bid: 200 },
    { id: 4, title: "Item Title 4", status: "Open", bid: 200 },
    { id: 5, title: "Item Title 5", status: "Open", bid: 200 },
  ];

  function pickRandomItems(array, count) {
    const pickedItems = [];
    const usedIndices = new Set();

    while (pickedItems.length < count && usedIndices.size < array.length) {
      const randomIndex = Math.floor(Math.random() * array.length);

      if (!usedIndices.has(randomIndex)) {
        pickedItems.push(array[randomIndex]);
        usedIndices.add(randomIndex);
      }
    }

    return pickedItems;
  }
  const fetchData = () => {
    // Mock API response
    const response = pickRandomItems(items, 3);
    console.log(response);

    const existingIds = $(".card")
      .map((_, el) => $(el).data("id"))
      .get();
    const newIds = response.map((item) => item.id);

    // Remove cards that are no longer in the response
    existingIds.forEach((id) => {
      if (!newIds.includes(id)) {
        $(`.card[data-id=${id}]`).fadeOut(500, function () {
          $(this).remove();
        });
      }
    });

    // Add or update cards from the response
    response.forEach((item) => {
      const card = $(`.card[data-id=${item.id}]`);

      if (card.length > 0) {
        // Update existing card
        card.find(".card-title").text(item.title);
        card.find(".highlight-number").text(`${item.bid}`);
        const statusPill = card.find(".status-pill");
        statusPill.removeClass("open closing-soon");
        if (item.status === "Open") {
          statusPill.addClass("open").text("Open");
        } else {
          statusPill.addClass("closing-soon").text("Closing Soon");
        }
      } else {
        // Add new card
        const newCard = $(`
            <div class="card"  data-id="${item.id}">
            <img src="assets/img/item-1.jpg" alt="${
              item.title
            }" class="card-image">
            <div class="card-content">
                <div class="card-header">
                    <h3 class="card-title">${item.title}</h3>
                    <div class="status-pill ${
                      item.status === "Open" ? "open" : "closing-soon"
                    }">
                    ${item.status}
                    </div>
                </div>
                <div class="card-details">
                    <p class="highlight-title">Highest Bid <small>(AED)</small></p>
                    <p class="highlight-number">${item.bid}</p>
                </div>
            </div>
        </div>
          `);
        setTimeout(() => {
          if (item.status === "Open") {
            $("#cardContainerOpen").append(newCard.hide().fadeIn(2000));
          } else {
            $("#cardContainerClosing").append(newCard.hide().fadeIn(2000));
          }
        }, 1000);
      }
    });
    setTimeout(() => {
      $(".card").click(function () {
        const index = $(this).index();
        console.log(index);
        response.splice(index, 1);
      });
    });
  };

  // Poll data every 3 seconds
  setInterval(fetchData, 10000);

  // Fetch initial data
  fetchData();
});
