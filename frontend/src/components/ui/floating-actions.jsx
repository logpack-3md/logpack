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

export function FloatingActions() {
  const [notificationOpen, setNotificationOpen] = React.useState(false);
  const [profileOpen, setProfileOpen] = React.useState(false);

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
      message: "Alguém comentou no seu post.",
      time: "10 min atrás",
      icon: ExclamationTriangleIcon,
    },
    {
      type: "info",
      title: "Atualização disponível",
      message: "Nova versão do dashboard.",
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
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg border border-gray-200">
      {/* Sininho */}
      <Menu open={notificationOpen} handler={setNotificationOpen} placement="bottom-end">
        <MenuHandler>
          <IconButton
            variant="text"
            size="sm"
            className="text-gray-700 hover:text-primary hover:bg-gray-100 rounded-full"
          >
            <Badge
              content={notifications.length}
              className="bg-red-500 text-white text-xs"
              invisible={notifications.length === 0}
            >
              <BellIcon className="h-5 w-5" />
            </Badge>
          </IconButton>
        </MenuHandler>

        <MenuList className="max-h-96 w-80 p-0 overflow-auto border border-gray-200 rounded-lg shadow-xl">
          <div className="px-4 py-3 border-b bg-gray-50">
            <Typography variant="h6" className="font-semibold">
              Notificações
            </Typography>
          </div>
          {notifications.length > 0 ? (
            notifications.map((notif, i) => {
              const Icon = notif.icon;
              const color =
                notif.type === "success" ? "text-green-600" :
                notif.type === "warning" ? "text-yellow-600" : "text-blue-600";

              return (
                <MenuItem key={i} className="flex gap-3 p-3 hover:bg-gray-50">
                  <div className={`mt-0.5 ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <Typography variant="small" className="font-medium">
                      {notif.title}
                    </Typography>
                    <Typography variant="small" className="text-gray-600 text-sm">
                      {notif.message}
                    </Typography>
                    <Typography variant="small" className="text-gray-400 text-xs">
                      {notif.time}
                    </Typography>
                  </div>
                </MenuItem>
              );
            })
          ) : (
            <div className="p-6 text-center text-gray-500">
              <BellIcon className="h-10 w-10 mx-auto mb-2 text-gray-300" />
              <p>Sem notificações</p>
            </div>
          )}
        </MenuList>
      </Menu>

      {/* Avatar */}
      <Menu open={profileOpen} handler={setProfileOpen} placement="bottom-end">
        <MenuHandler>
          <IconButton
            variant="text"
            size="sm"
            className="p-0 rounded-full overflow-hidden hover:ring-2 hover:ring-primary/20"
          >
            <Avatar
              size="sm"
              alt="Usuário"
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1480&q=80"
              className="border-2 border-white shadow-sm"
            />
          </IconButton>
        </MenuHandler>

        <MenuList className="w-56 p-1 border border-gray-200 rounded-lg shadow-xl">
          {profileMenuItems.map(({ label, icon: Icon, danger }) => (
            <MenuItem
              key={label}
              className={`flex items-center gap-2 p-2 rounded ${
                danger ? "text-red-600 hover:bg-red-50" : "hover:bg-gray-100"
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
  );
}