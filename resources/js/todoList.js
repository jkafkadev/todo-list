const items = document.querySelectorAll('.todoItem')

for (const item of items) {
    const itemTitle = item.children.item(0)
    const itemButton = item.children.item(1)
    const itemDelete = item.children.item(2)
    if (itemTitle && itemButton) {
        itemButton.addEventListener('click', async () => {
            const result = await fetch('/api/toggleComplete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ item: itemTitle.textContent })
            })
            const row = await result.json()
            if (row.done == 0) itemButton.textContent = 'Mark Complete'
            else itemButton.textContent = 'Mark Incomplete'
        })
    }
    if (itemDelete) {
        itemDelete.addEventListener('click', async () => {
            const result = await fetch('/api/item', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ item: itemTitle.textContent })
            })
            let row = undefined;
            if (result.bodyUsed) row = await result.json()

            if (!row) {
                item.remove()
            }
        })
    }
}