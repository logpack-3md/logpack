import React from "react";
import {
  IconButton,
  Avatar,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Typography,
  Badge,
} from "@material-tailwind/react";
import {
  BellIcon,
  UserCircleIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export function DashboardNavbar() {
  const [notificationOpen, setNotificationOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);

  // Simulação de notificações
  const notifications = [
    {
      type: "success",
      title: "Post publicado!",
      message: "Seu artigo sobre blockchain foi ao ar.",
      time: "2 min atrás",
      icon: CheckCircleIcon,
    },
    {
      type: "warning",
      title: "Comentário novo",
      message: "Alguém comentou no seu post de ontem.",
      time: "10 min atrás",
      icon: ExclamationTriangleIcon,
    },
    {
      type: "info",
      title: "Atualização do sistema",
      message: "Nova versão do dashboard disponível.",
      time: "1h atrás",
      icon: BellIcon,
    },
  ];

  const profileMenuItems = [
    { label: "Meu Perfil", icon: UserCircleIcon },
    { label: "Configurações", icon: CogIcon },
    { label: "Sair", icon: ArrowRightOnRectangleIcon, danger: true },
  ];

  return (
    <div className="sticky top-0 z-30 bg-transparent px-4 py-3 lg:px-6">
      <div className="flex items-center justify-end gap-2">

        {/* Sininho com Dropdown */}
        <Menu open={notificationOpen} handler={setNotificationOpen} placement="bottom-end">
          <MenuHandler>
            <IconButton variant="text" className="relative text-gray-700 hover:text-primary">
              <Badge
                content={notifications.length}
                placement="top-end"
                className="bg-gray-500 text-white text-xs"
                invisible={notifications.length === 0}
              >
                <BellIcon className="h-5 w-5" />
              </Badge>
            </IconButton>
          </MenuHandler>

          <MenuList className="max-h-96 w-80 p-0 overflow-auto border border-gray-200 rounded-lg shadow-lg">
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-500">
              <Typography variant="h6" className="font-semibold text-gray-900">
                Notificações
              </Typography>
            </div>

            {notifications.length > 0 ? (
              notifications.map((notif, index) => {
                const Icon = notif.icon;
                const color = notif.type === "success" ? "text-green-600" :
                             notif.type === "warning" ? "text-yellow-600" : "text-blue-600";

                return (
                  <MenuItem
                    key={index}
                    className="flex items-start gap-3 p-3 hover:bg-gray-500 border-b border-gray-50 last:border-0"
                  >
                    <div className={`mt-0.5 ${color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <Typography variant="small" className="font-medium text-gray-900">
                        {notif.title}
                      </Typography>
                      <Typography variant="small" className="text-gray-600 text-sm">
                        {notif.message}
                      </Typography>
                      <Typography variant="small" className="text-gray-400 text-xs mt-1">
                        {notif.time}
                      </Typography>
                    </div>
                  </MenuItem>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-500">
                <BellIcon className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                <p>Nenhuma notificação</p>
              </div>
            )}
          </MenuList>
        </Menu>

        {/* Avatar com Dropdown */}
        <Menu open={profileOpen} handler={setProfileOpen} placement="bottom-end">
          <MenuHandler>
            <IconButton variant="text" className="p-0">
              <Avatar
                size="sm"
                alt="Usuário"
                src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80"
                className="border-2 border-white shadow-md hover:shadow-lg transition-shadow"
              />
            </IconButton>
          </MenuHandler>

          <MenuList className="w-56 p-1 border border-gray-200 rounded-lg shadow-lg">
            {profileMenuItems.map(({ label, icon: Icon, danger }, key) => (
              <MenuItem
                key={label}
                className={`flex items-center gap-2 rounded p-2 ${
                  danger ? "text-red-600 hover:bg-gray-50" : "hover:bg-gray-100"
                }`}
                onClick={() => setProfileOpen(false)}
              >
                <Icon className={`h-4 w-4 ${danger ? "text-red-600" : "text-gray-600"}`} />
                <Typography variant="small" className="font-medium">
                  {label}
                </Typography>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

      </div>
    </div>
  );
}