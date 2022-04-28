const sidebarTigger = () => {
    const element = document.getElementById('sidebar')

    if (element.classList.contains("hide-md") === true) {
        element.classList.remove('hide-md');
        document.getElementById('sidebarhead').classList.remove('col-2')
        document.getElementById('contenthead').classList.remove('col-12')
        document.getElementById('contenthead').classList.add('col-10')
    } else {
        element.classList.add('hide-md');
        document.getElementById('sidebarhead').classList.add('col-2')
        document.getElementById('contenthead').classList.remove('col-10')
        document.getElementById('contenthead').classList.add('col-12')
    }
    // sidebar.classList.remove('hide-md');
}

const notificationBar = document.getElementById('notification')

const notificationopen = () => {
    notificationBar.style.opacity = '100'
    notificationBar.style.visibility = 'visible'
    notificationBar.style.pointerEvents = 'auto'
    notificationBar.style.userSelect = 'auto'
}
const notificationclose = () => {
    notificationBar.style.opacity = '0'
    notificationBar.style.visibility = 'hidden'
    notificationBar.style.pointerEvents = 'none'
    notificationBar.style.userSelect = 'none'
}