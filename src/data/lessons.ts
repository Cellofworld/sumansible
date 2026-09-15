export interface Lesson {
  id: number;
  title: string;
  icon: string;
  theory: string[];
  code: { title: string; language: string; code: string }[];
  tips: string[];
  quiz?: {
    question: string;
    options: string[];
    correct: number;
  };
}

export const lessons: Lesson[] = [
  {
    id: 1,
    title: "Введение в Ansible",
    icon: "🚀",
    theory: [
      "Ansible — это система управления конфигурациями и оркестрации IT-инфраструктуры. Она позволяет автоматизировать развёртывание приложений, управление конфигурациями серверов и выполнение задач на множестве машин одновременно.",
      "Ключевые особенности Ansible:",
      "• Agentless — не требует установки агентов на управляемых машинах. Использует SSH для Linux и WinRM для Windows.",
      "• Declarative — вы описываете желаемое состояние системы, а Ansible сам определяет, какие шаги нужно выполнить.",
      "• Idempotent — повторный запуск playbook не приводит к нежелательным изменениям, если система уже в нужном состоянии.",
      "• Human-readable — конфигурации пишутся на YAML, который легко читать и понимать.",
      "Ansible был создан Майклом ДеХааном в 2012 году и приобретён компанией Red Hat в 2015 году. Сейчас это один из самых популярных инструментов автоматизации в мире DevOps."
    ],
    code: [
      {
        title: "Пример простого playbook",
        language: "yaml",
        code: `---
- name: Мой первый playbook
  hosts: webservers
  become: yes
  
  tasks:
    - name: Установить nginx
      apt:
        name: nginx
        state: present

    - name: Запустить nginx
      service:
        name: nginx
        state: started
        enabled: yes`
      }
    ],
    tips: [
      "Ansible использует push-модель: управляющая машина отправляет команды на управляемые.",
      "Для начала работы достаточно Python на управляющей машине и SSH-доступ к управляемым."
    ],
    quiz: {
      question: "Какой подход использует Ansible для связи с управляемыми машинами?",
      options: ["Agent-based (требует агента)", "Agentless (через SSH/WinRM)", "Только через API", "Через REST-сервис"],
      correct: 1
    }
  },
  {
    id: 2,
    title: "Установка и настройка",
    icon: "⚙️",
    theory: [
      "Для работы с Ansible необходимо установить его на управляющую машину (control node). Управляемые машины требуют только Python и SSH-доступ.",
      "Системные требования для управляющей машины:",
      "• Python 3.8 или выше",
      "• Linux, macOS или WSL2 (Windows Subsystem for Linux)",
      "• SSH-клиент (openssh)",
      "Рекомендуемый способ установки — через pip или пакетный менеджер вашей ОС.",
      "После установки необходимо настроить файл инвентаря (inventory), который описывает список управляемых машин."
    ],
    code: [
      {
        title: "Установка через pip",
        language: "bash",
        code: `# Установка через pip
pip install ansible

# Проверка версии
ansible --version

# Установка конкретной версии
pip install ansible==9.1.0`
      },
      {
        title: "Установка на Ubuntu/Debian",
        language: "bash",
        code: `# Добавление репозитория
sudo apt update
sudo apt install software-properties-common
sudo apt-add-repository ppa:ansible/ansible

# Установка
sudo apt update
sudo apt install ansible`
      },
      {
        title: "Файл инвентаря (inventory)",
        language: "ini",
        code: `# /etc/ansible/hosts или ~/inventory.ini

[webservers]
web1.example.com
web2.example.com
192.168.1.10 ansible_port=2222

[dbservers]
db1.example.com ansible_user=postgres
db2.example.com

[production:children]
webservers
dbservers

[production:vars]
ansible_python_interpreter=/usr/bin/python3`
      }
    ],
    tips: [
      "Всегда используйте виртуальные окружения Python для установки Ansible.",
      "Можно использовать несколько файлов инвентаря для разных окружений (dev, staging, production)."
    ],
    quiz: {
      question: "Какой минимальный набор нужен на управляемой машине для работы Ansible?",
      options: ["Ansible + SSH-сервер", "Python + SSH-сервер", "Только SSH-сервер", "Docker + Python"],
      correct: 1
    }
  },
  {
    id: 3,
    title: "Ad-hoc команды",
    icon: "⚡",
    theory: [
      "Ad-hoc команды — это одноразовые команды Ansible, которые выполняются без создания playbook. Они полезны для быстрых операций на нескольких серверах.",
      "Синтаксис ad-hoc команды:",
      "ansible <группа_хостов> -m <модуль> -a '<аргументы>'",
      "Основные флаги:",
      "• -m — модуль для выполнения (по умолчанию 'command')",
      "• -a — аргументы модуля",
      "• -b или --become — выполнить с повышенными привилегиями (sudo)",
      "• -i — путь к файлу инвентаря",
      "• --limit — ограничить выполнение определёнными хостами"
    ],
    code: [
      {
        title: "Проверка соединения",
        language: "bash",
        code: `# Проверка доступности всех хостов
ansible all -m ping -i inventory.ini

# Проверка конкретной группы
ansible webservers -m ping`
      },
      {
        title: "Управление пакетами",
        language: "bash",
        code: `# Установка пакета на всех серверах
ansible webservers -b -m apt -a "name=nginx state=present"

# Обновление всех пакетов
ansible all -b -m apt -a "upgrade=dist"

# Удаление пакета
ansible webservers -b -m apt -a "name=apache2 state=absent"`
      },
      {
        title: "Работа с файлами и сервисами",
        language: "bash",
        code: `# Копирование файла
ansible webservers -m copy -a "src=./config.txt dest=/etc/config.txt"

# Управление сервисом
ansible webservers -b -m service -a "name=nginx state=restarted"

# Выполнение произвольной команды
ansible webservers -m shell -a "df -h | grep /dev"`
      }
    ],
    tips: [
      "Используйте --check для dry-run (проверка без реальных изменений).",
      "Флаг -v, -vv, -vvv, -vvvv увеличивает детализацию вывода."
    ],
    quiz: {
      question: "Какой флаг используется для выполнения команды с правами sudo?",
      options: ["-s", "-b (--become)", "--sudo", "-root"],
      correct: 1
    }
  },
  {
    id: 4,
    title: "Модули Ansible",
    icon: "📦",
    theory: [
      "Модули — это строительные блоки Ansible. Каждый модуль выполняет определённую задачу: установка пакетов, управление файлами, работа с облачными провайдерами и т.д.",
      "В Ansible доступно более 4000 модулей. Наиболее часто используемые:",
      "• apt/yum/dnf — управление пакетами",
      "• copy/template/file — работа с файлами",
      "• service/systemd — управление сервисами",
      "• user/group — управление пользователями",
      "• git — работа с репозиториями",
      "• uri — HTTP-запросы",
      "• debug — отладка",
      "Документацию по любому модулю можно получить командой: ansible-doc <имя_модуля>"
    ],
    code: [
      {
        title: "Модуль file — управление файлами",
        language: "yaml",
        code: `---
- name: Работа с файлами
  hosts: all
  tasks:
    - name: Создать директорию
      file:
        path: /opt/myapp
        state: directory
        mode: '0755'
        owner: www-data
        group: www-data

    - name: Создать символическую ссылку
      file:
        src: /opt/myapp/config
        dest: /etc/myapp
        state: link

    - name: Удалить файл
      file:
        path: /tmp/old_file.txt
        state: absent`
      },
      {
        title: "Модуль template — шаблонизация",
        language: "yaml",
        code: `---
- name: Шаблонизация конфигурации
  hosts: webservers
  vars:
    server_name: example.com
    port: 8080
  tasks:
    - name: Развернуть конфиг из шаблона
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/nginx.conf
        owner: root
        group: root
        mode: '0644'
      notify: Restart nginx`
      },
      {
        title: "Модуль user — управление пользователями",
        language: "yaml",
        code: `---
- name: Управление пользователями
  hosts: all
  become: yes
  tasks:
    - name: Создать пользователя
      user:
        name: deploy
        shell: /bin/bash
        groups: sudo,www-data
        create_home: yes
        state: present

    - name: Добавить SSH-ключ
      authorized_key:
        user: deploy
        state: present
        key: "{{ lookup('file', '~/.ssh/id_rsa.pub') }}"`
      }
    ],
    tips: [
      "Используйте ansible-doc -l для списка всех доступных модулей.",
      "Модуль debug незаменим для отладки — выводит переменные и сообщения."
    ],
    quiz: {
      question: "Какой модуль используется для создания файлов из Jinja2-шаблонов?",
      options: ["copy", "file", "template", "jinja2"],
      correct: 2
    }
  },
  {
    id: 5,
    title: "Playbooks",
    icon: "📋",
    theory: [
      "Playbook — это основной файл конфигурации Ansible. Это YAML-файл, который описывает набор задач (tasks) для выполнения на определённых хостах.",
      "Структура playbook:",
      "• Play — определение группы хостов и глобальных параметров",
      "• Tasks — список задач, которые нужно выполнить",
      "• Handlers — задачи, которые выполняются по уведомлению (notify)",
      "• Vars — переменные для данного play",
      "• Roles — подключение ролей",
      "Каждая задача должна иметь имя (name) для понятного вывода при выполнении."
    ],
    code: [
      {
        title: "Полный playbook для веб-сервера",
        language: "yaml",
        code: `---
- name: Настройка веб-сервера
  hosts: webservers
  become: yes
  vars:
    http_port: 80
    server_name: mysite.com
    doc_root: /var/www/mysite

  tasks:
    - name: Обновить кэш apt
      apt:
        update_cache: yes
        cache_valid_time: 3600

    - name: Установить nginx
      apt:
        name: nginx
        state: present

    - name: Создать директорию сайта
      file:
        path: "{{ doc_root }}"
        state: directory
        owner: www-data
        group: www-data

    - name: Развернуть конфигурацию nginx
      template:
        src: templates/nginx.conf.j2
        dest: /etc/nginx/sites-available/default
      notify: Restart nginx

    - name: Включить сайт
      file:
        src: /etc/nginx/sites-available/default
        dest: /etc/nginx/sites-enabled/default
        state: link
      notify: Restart nginx

    - name: Запустить nginx
      service:
        name: nginx
        state: started
        enabled: yes

  handlers:
    - name: Restart nginx
      service:
        name: nginx
        state: restarted`
      },
      {
        title: "Использование include и import",
        language: "yaml",
        code: `---
- name: Основной playbook
  hosts: all
  tasks:
    # Статический импорт (обрабатывается при парсинге)
    - import_tasks: tasks/setup.yml
    
    # Динамическое включение (обрабатывается при выполнении)
    - include_tasks: tasks/deploy.yml
      vars:
        app_version: "1.2.3"

    # Импорт playbook
    - import_playbook: monitoring.yml`
      }
    ],
    tips: [
      "Handlers запускаются только один раз, даже если notify вызван несколько раз.",
      "Используйте tags для выборочного выполнения задач: ansible-playbook site.yml --tags 'deploy'"
    ],
    quiz: {
      question: "Что произойдёт, если notify вызвать несколько раз для одного handler?",
      options: [
        "Handler выполнится несколько раз",
        "Handler выполнится только один раз",
        "Будет ошибка",
        "Handler не выполнится"
      ],
      correct: 1
    }
  },
  {
    id: 6,
    title: "Переменные и факты",
    icon: "🔤",
    theory: [
      "Переменные в Ansible позволяют параметризовать конфигурации и делать их переиспользуемыми.",
      "Источники переменных (по приоритету от низкого к высокому):",
      "1. Group vars (групповые переменные)",
      "2. Host vars (переменные хоста)",
      "3. Переменные в playbook (vars)",
      "4. Переменные в командной строке (-e)",
      "5. Extra vars (наивысший приоритет)",
      "Facts (факты) — это информация о системе, собранная модулем setup автоматически при каждом запуске playbook. Доступны через переменную ansible_facts.",
      "Примеры фактов: ansible_facts['os_family'], ansible_facts['default_ipv4']['address'], ansible_facts['memtotal_mb']."
    ],
    code: [
      {
        title: "Определение переменных",
        language: "yaml",
        code: `---
# vars/main.yml
app_name: myapp
app_version: "2.1.0"
app_port: 8080
app_users:
  - name: admin
    role: administrator
  - name: deploy
    role: developer

database:
  host: db.example.com
  port: 5432
  name: myapp_db`
      },
      {
        title: "Использование переменных",
        language: "yaml",
        code: `---
- name: Демонстрация переменных
  hosts: all
  vars_files:
    - vars/common.yml
    - "vars/{{ ansible_facts['os_family'] }}.yml"
  
  tasks:
    - name: Показать информацию
      debug:
        msg: "Приложение {{ app_name }} v{{ app_version }}"

    - name: Использовать факты
      debug:
        msg: "ОС: {{ ansible_facts['distribution'] }}, IP: {{ ansible_facts['default_ipv4']['address'] }}"

    - name: Цикл по списку
      debug:
        msg: "Пользователь: {{ item.name }}, Роль: {{ item.role }}"
      loop: "{{ app_users }}"

    - name: Условие с переменной
      debug:
        msg: "Это Debian-система!"
      when: ansible_facts['os_family'] == "Debian"`
      },
      {
        title: "Group vars и host vars",
        language: "yaml",
        code: `# Структура директорий:
# inventory/
# ├── hosts.ini
# ├── group_vars/
# │   ├── all.yml          # для всех хостов
# │   ├── webservers.yml   # для группы webservers
# │   └── dbservers.yml    # для группы dbservers
# └── host_vars/
#     ├── web1.yml         # для конкретного хоста
#     └── db1.yml

# group_vars/webservers.yml
---
http_port: 80
https_port: 443
max_clients: 200

# host_vars/web1.yml
---
ansible_host: 192.168.1.10
server_priority: high`
      }
    ],
    tips: [
      "Используйте ansible_facts вместо ansible_* для совместимости с будущими версиями.",
      "Флаг --extra-vars (или -e) позволяет переопределить переменные из командной строки."
    ],
    quiz: {
      question: "Какой источник переменных имеет наивысший приоритет?",
      options: ["Group vars", "Host vars", "Extra vars (-e)", "Vars в playbook"],
      correct: 2
    }
  },
  {
    id: 7,
    title: "Условия и циклы",
    icon: "🔄",
    theory: [
      "Условия (when) позволяют выполнять задачи только при определённых обстоятельствах. Циклы (loop) позволяют повторять задачи для каждого элемента списка.",
      "Условия when поддерживают:",
      "• Сравнения: ==, !=, >, <, >=, <=\n• Логические операторы: and, or, not\n• Проверку определённости: is defined, is undefined\n• Проверку пустоты: | length > 0\n• Регулярные выражения: is match('pattern')",
      "Типы циклов:",
      "• loop — простой цикл по списку",
      "• with_items — аналог loop (устаревший синтаксис)",
      "• with_dict — цикл по словарю",
      "• with_fileglob — цикл по файлам по маске",
      "• until + retries — повторять до выполнения условия"
    ],
    code: [
      {
        title: "Условия when",
        language: "yaml",
        code: `---
- name: Демонстрация условий
  hosts: all
  tasks:
    - name: Установить пакет только для Debian
      apt:
        name: htop
        state: present
      when: ansible_facts['os_family'] == "Debian"

    - name: Установить пакет только для RedHat
      yum:
        name: htop
        state: present
      when: ansible_facts['os_family'] == "RedHat"

    - name: Выполнить, если переменная определена
      debug:
        msg: "Версия: {{ app_version }}"
      when: app_version is defined

    - name: Множественные условия
      debug:
        msg: "Production сервер"
      when:
        - env == "production"
        - ansible_facts['memtotal_mb'] > 4096
        - "'webserver' in group_names"

    - name: Условие с регистрацией
      shell: cat /etc/os-release
      register: os_info

    - name: Действие на основе результата
      debug:
        msg: "Это Ubuntu!"
      when: "'Ubuntu' in os_info.stdout"`
      },
      {
        title: "Циклы loop",
        language: "yaml",
        code: `---
- name: Демонстрация циклов
  hosts: all
  vars:
    packages:
      - nginx
      - python3
      - git
      - curl
    users:
      - { name: alice, group: developers }
      - { name: bob, group: operations }
      - { name: charlie, group: developers }

  tasks:
    - name: Установить пакеты
      apt:
        name: "{{ item }}"
        state: present
      loop: "{{ packages }}"

    - name: Создать пользователей
      user:
        name: "{{ item.name }}"
        groups: "{{ item.group }}"
        state: present
      loop: "{{ users }}"
      when: item.name != 'charlie'

    - name: Цикл с словарём
      debug:
        msg: "Ключ: {{ item.key }}, Значение: {{ item.value }}"
      loop: "{{ lookup('dict', my_dict) }}"

    - name: Повторять до успеха
      uri:
        url: "http://localhost:8080/health"
        status_code: 200
      register: result
      until: result.status == 200
      retries: 10
      delay: 5`
      }
    ],
    tips: [
      "Используйте loop_control для именования элементов: loop_control: { loop_var: my_item }",
      "when проверяется ДО выполнения задачи, что экономит время."
    ],
    quiz: {
      question: "Как повторять задачу до успешного выполнения?",
      options: [
        "loop + when",
        "until + retries + delay",
        "repeat_until",
        "retry: infinite"
      ],
      correct: 1
    }
  },
  {
    id: 8,
    title: "Роли (Roles)",
    icon: "🎭",
    theory: [
      "Роли — это способ организации playbook в переиспользуемые модули. Они позволяют структурировать код, переменные, файлы и шаблоны в единый пакет.",
      "Стандартная структура роли:",
      "role_name/\n├── defaults/main.yml    — переменные по умолчанию (низкий приоритет)\n├── vars/main.yml        — переменные роли (высокий приоритет)\n├── tasks/main.yml       — основные задачи\n├── handlers/main.yml    — обработчики\n├── templates/           — Jinja2-шаблоны\n├── files/               — статические файлы\n├── meta/main.yml        — метаданные и зависимости\n└── tests/               — тесты",
      "Роли можно публиковать в Ansible Galaxy — публичном репозитории ролей, и использовать их в своих проектах."
    ],
    code: [
      {
        title: "Создание роли",
        language: "bash",
        code: `# Создать структуру роли
ansible-galaxy init myrole

# Создать роль для проекта
ansible-galaxy init --init-path roles/ nginx

# Установить роль из Galaxy
ansible-galaxy install geerlingguy.nginx

# Установить по requirements.yml
ansible-galaxy install -r requirements.yml`
      },
      {
        title: "tasks/main.yml роли nginx",
        language: "yaml",
        code: `---
# roles/nginx/tasks/main.yml
- name: Установить nginx
  apt:
    name: nginx
    state: present
  tags: [nginx, install]

- name: Развернуть конфигурацию
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
  notify: Restart nginx
  tags: [nginx, config]

- name: Развернуть vhost
  template:
    src: vhost.conf.j2
    dest: "/etc/nginx/sites-available/{{ server_name }}"
  notify: Restart nginx
  tags: [nginx, config]

- name: Включить сайт
  file:
    src: "/etc/nginx/sites-available/{{ server_name }}"
    dest: "/etc/nginx/sites-enabled/{{ server_name }}"
    state: link
  notify: Restart nginx

- name: Запустить nginx
  service:
    name: nginx
    state: started
    enabled: yes
  tags: [nginx, service]`
      },
      {
        title: "Использование ролей в playbook",
        language: "yaml",
        code: `---
- name: Развёртывание приложения
  hosts: webservers
  become: yes
  
  vars:
    server_name: myapp.com
    app_version: "2.0"

  roles:
    - role: common
      tags: common
    
    - role: nginx
      nginx_port: 80
      tags: web
    
    - role: app
      tags: deploy

  pre_tasks:
    - name: Проверить доступность
      ping:
      tags: always

  post_tasks:
    - name: Уведомление об успехе
      debug:
        msg: "Развёртывание завершено!"
      tags: always`
      },
      {
        title: "requirements.yml",
        language: "yaml",
        code: `---
roles:
  - name: geerlingguy.nginx
    version: "3.2.0"
  - name: geerlingguy.postgresql
    version: "3.4.0"
  - src: https://github.com/myorg/my-role
    scm: git
    version: main
    name: custom_role

collections:
  - name: community.general
    version: ">=5.0.0"
  - name: ansible.posix`
      }
    ],
    tips: [
      "Используйте ansible-galaxy init для быстрого создания структуры роли.",
      "defaults/main.yml — для значений, которые пользователь может переопределить. vars/main.yml — для внутренних переменных роли."
    ],
    quiz: {
      question: "Какой файл в роли содержит переменные с наименьшим приоритетом?",
      options: ["vars/main.yml", "defaults/main.yml", "tasks/main.yml", "meta/main.yml"],
      correct: 1
    }
  },
  {
    id: 9,
    title: "Обработчики и теги",
    icon: "🏷️",
    theory: [
      "Handlers (обработчики) — это специальные задачи, которые выполняются только при уведомлении (notify). Они запускаются в конце play и только один раз, даже если notify вызван многократно.",
      "Типичные сценарии handlers:",
      "• Перезапуск сервиса после изменения конфигурации",
      "• Перезагрузка системы после обновления ядра",
      "• Применение настроек firewall",
      "Теги (tags) позволяют выборочно запускать задачи. Можно назначить тег задаче, роли или целому play.",
      "Команды для работы с тегами:\n• --tags 'tag1,tag2' — выполнить только эти теги\n• --skip-tags 'tag1' — пропустить эти теги\n• --list-tags — показать все доступные теги"
    ],
    code: [
      {
        title: "Handlers в действии",
        language: "yaml",
        code: `---
- name: Настройка сервера
  hosts: webservers
  become: yes

  tasks:
    - name: Установить nginx
      apt:
        name: nginx
        state: present
      notify: Restart nginx

    - name: Конфигурация nginx
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/nginx.conf
      notify: 
        - Test nginx config
        - Restart nginx

    - name: Конфигурация firewall
      ufw:
        rule: allow
        port: '80'
        proto: tcp
      notify: Reload firewall

  handlers:
    - name: Test nginx config
      command: nginx -t
      listen: "Restart nginx"  # listen позволяет группировать

    - name: Restart nginx
      service:
        name: nginx
        state: restarted

    - name: Reload firewall
      command: ufw reload`
      },
      {
        title: "Теги для выборочного выполнения",
        language: "yaml",
        code: `---
- name: Playbook с тегами
  hosts: all
  become: yes

  tasks:
    - name: Обновить пакеты
      apt:
        upgrade: dist
      tags:
        - system
        - update

    - name: Установить приложение
      apt:
        name: "{{ app_packages }}"
      tags:
        - app
        - install

    - name: Развернуть конфиг
      template:
        src: app.conf.j2
        dest: /etc/app/config
      tags:
        - app
        - config
      notify: Restart app

    - name: Всегда выполнять
      debug:
        msg: "Эта задача выполнится всегда"
      tags: always

# Запуск:
# ansible-playbook site.yml --tags "app"
# ansible-playbook site.yml --skip-tags "update"
# ansible-playbook site.yml --tags "config" --check`
      }
    ],
    tips: [
      "Handlers выполняются в порядке определения, а не в порядке вызова notify.",
      "Тег 'always' гарантирует выполнение задачи при любом запуске."
    ],
    quiz: {
      question: "Когда выполняются handlers?",
      options: [
        "Сразу после notify",
        "В начале play",
        "В конце play (или по flush_handlers)",
        "Никогда автоматически"
      ],
      correct: 2
    }
  },
  {
    id: 10,
    title: "Ansible Vault",
    icon: "🔐",
    theory: [
      "Ansible Vault — это встроенный механизм шифрования конфиденциальных данных (паролей, ключей, сертификатов). Он позволяет хранить секреты прямо в репозитории.",
      "Vault использует AES-256 шифрование. Зашифрованные файлы можно безопасно коммитить в Git.",
      "Основные операции:",
      "• ansible-vault encrypt — зашифровать файл",
      "• ansible-vault decrypt — расшифровать файл",
      "• ansible-vault edit — редактировать зашифрованный файл",
      "• ansible-vault create — создать новый зашифрованный файл",
      "• ansible-vault rekey — изменить пароль шифрования",
      "При запуске playbook с зашифрованными данными нужно предоставить пароль через --ask-vault-pass или --vault-password-file."
    ],
    code: [
      {
        title: "Работа с Vault",
        language: "bash",
        code: `# Создать зашифрованный файл
ansible-vault create secrets.yml

# Зашифровать существующий файл
ansible-vault encrypt vars/secrets.yml

# Расшифровать файл
ansible-vault decrypt vars/secrets.yml

# Редактировать зашифрованный файл
ansible-vault edit vars/secrets.yml

# Изменить пароль
ansible-vault rekey vars/secrets.yml

# Запустить playbook с vault
ansible-playbook site.yml --ask-vault-pass

# Использовать файл с паролем
ansible-playbook site.yml --vault-password-file ~/.vault_pass`
      },
      {
        title: "Структура зашифрованных переменных",
        language: "yaml",
        code: `# vars/secrets.yml (зашифрован)
---
db_password: SuperSecretPassword123!
api_key: sk-abc123def456
ssl_private_key: |
  -----BEGIN RSA PRIVATE KEY-----
  MIIEpAIBAAKCAQEA...
  -----END RSA PRIVATE KEY-----

# Использование в playbook
---
- name: Развёртывание с секретами
  hosts: all
  vars_files:
    - vars/secrets.yml
  
  tasks:
    - name: Настроить подключение к БД
      template:
        src: db.conf.j2
        dest: /etc/app/db.conf
      vars:
        db_pass: "{{ db_password }}"`
      },
      {
        title: "Vault с несколькими идентификаторами",
        language: "bash",
        code: `# Создать vault с ID (для разных окружений)
ansible-vault encrypt --vault-id dev@dev-pass.txt secrets_dev.yml
ansible-vault encrypt --vault-id prod@prod-pass.txt secrets_prod.yml

# Запуск с несколькими vault-id
ansible-playbook site.yml \\
  --vault-id dev@dev-pass.txt \\
  --vault-id prod@promt

# Скрипт для получения пароля (vault-pass.sh)
#!/bin/bash
echo "my-vault-password"

# Использование скрипта
ansible-playbook site.yml --vault-password-file vault-pass.sh`
      }
    ],
    tips: [
      "Никогда не храните файл с паролем vault в Git!",
      "Используйте разные vault-id для разных окружений (dev, staging, production)."
    ],
    quiz: {
      question: "Какой алгоритм шифрования использует Ansible Vault?",
      options: ["AES-128", "AES-256", "RSA-2048", "Blowfish"],
      correct: 1
    }
  },
  {
    id: 11,
    title: "Ansible Galaxy и Collections",
    icon: "🌌",
    theory: [
      "Ansible Galaxy — это публичный репозиторий ролей и коллекций для Ansible. Он позволяет находить, скачивать и публиковать переиспользуемый код.",
      "Collections — это новый формат распространения контента Ansible (появился в версии 2.10). Коллекция включает модули, плагины, роли и документацию.",
      "Примеры популярных коллекций:",
      "• community.general — общие модули",
      "• ansible.posix — модули для POSIX-систем",
      "• community.docker — работа с Docker",
      "• amazon.aws / azure.azcollection — облачные провайдеры",
      "• kubernetes.core — работа с Kubernetes"
    ],
    code: [
      {
        title: "Работа с Galaxy CLI",
        language: "bash",
        code: `# Поиск роли
ansible-galaxy role search nginx

# Информация о роли
ansible-galaxy role info geerlingguy.nginx

# Установка роли
ansible-galaxy role install geerlingguy.nginx

# Установка коллекции
ansible-galaxy collection install community.docker

# Список установленных коллекций
ansible-galaxy collection list

# Поиск коллекции
ansible-galaxy collection search docker`
      },
      {
        title: "Использование коллекций",
        language: "yaml",
        code: `---
- name: Использование коллекций
  hosts: all
  
  collections:
    - community.general
    - community.docker

  tasks:
    - name: Docker контейнер (из коллекции)
      community.docker.docker_container:
        name: myapp
        image: nginx:latest
        ports:
          - "8080:80"
        state: started

    - name: Модуль из community.general
      community.general.htpasswd:
        path: /etc/nginx/.htpasswd
        name: admin
        password: "{{ admin_password }}"
        owner: root

    - name: Полное имя модуля (FQCN)
      community.general.system.cron:
        name: "backup"
        minute: "0"
        hour: "2"
        job: "/usr/local/bin/backup.sh"`
      },
      {
        title: "Создание своей коллекции",
        language: "bash",
        code: `# Инициализация коллекции
ansible-galaxy collection init myorg.mycollection

# Структура:
# myorg/mycollection/
# ├── galaxy.yml           # метаданные
# ├── README.md
# ├── plugins/
# │   ├── modules/         # модули
# │   ├── module_utils/    # утилиты модулей
# │   └── action/          # action-плагины
# ├── roles/               # роли
# └── playbooks/           # playbook

# Сборка коллекции
cd myorg/mycollection
ansible-galaxy collection build

# Публикация в Galaxy
ansible-galaxy collection publish myorg-mycollection-1.0.0.tar.gz \\
  --api-key YOUR_API_KEY`
      }
    ],
    tips: [
      "Всегда используйте FQCN (Fully Qualified Collection Name) для модулей — это гарантирует правильный выбор модуля.",
      "Создайте requirements.yml для фиксации версий коллекций в проекте."
    ],
    quiz: {
      question: "Что такое FQCN в контексте Ansible?",
      options: [
        "Fast Query Collection Node",
        "Fully Qualified Collection Name",
        "File Query Configuration Name",
        "Fixed Quality Control Number"
      ],
      correct: 1
    }
  },
  {
    id: 12,
    title: "Практический проект",
    icon: "🏗️",
    theory: [
      "Давайте соберём всё изученное в реальный проект — автоматизированное развёртывание веб-приложения (LAMP/LEMP стек).",
      "Архитектура проекта:",
      "• Контрольная машина с Ansible",
      "• 2 веб-сервера (nginx + PHP)",
      "• 1 сервер базы данных (MySQL/PostgreSQL)",
      "• Балансировщик нагрузки (HAProxy)",
      "Мы создадим полную структуру с ролями, переменными, шаблонами и секретами.",
      "Этот проект демонстрирует лучшие практики: разделение по ролям, использование переменных, handlers, vault, тегов."
    ],
    code: [
      {
        title: "Структура проекта",
        language: "text",
        code: `lamp-stack/
├── ansible.cfg
├── inventory/
│   ├── production/
│   │   ├── hosts.ini
│   │   ├── group_vars/
│   │   │   ├── all.yml
│   │   │   ├── webservers.yml
│   │   │   └── dbservers.yml
│   │   └── host_vars/
│   └── staging/
├── roles/
│   ├── common/
│   ├── nginx/
│   ├── php/
│   ├── mysql/
│   ├── app/
│   └── haproxy/
├── site.yml
├── requirements.yml
└── scripts/
    └── deploy.sh`
      },
      {
        title: "ansible.cfg",
        language: "ini",
        code: `[defaults]
inventory = inventory/production/hosts.ini
roles_path = roles
remote_user = deploy
host_key_checking = False
retry_files_enabled = False
stdout_callback = yaml
forks = 10
timeout = 30

[privilege_escalation]
become = True
become_method = sudo
become_user = root

[ssh_connection]
pipelining = True
ssh_args = -o ControlMaster=auto -o ControlPersist=60s`
      },
      {
        title: "site.yml — главный playbook",
        language: "yaml",
        code: `---
# Базовая настройка всех серверов
- name: Базовая настройка
  hosts: all
  become: yes
  roles:
    - role: common
  tags: [base, common]

# Настройка веб-серверов
- name: Настройка веб-серверов
  hosts: webservers
  become: yes
  roles:
    - role: nginx
      tags: [web, nginx]
    - role: php
      tags: [web, php]
    - role: app
      tags: [web, app]
  post_tasks:
    - name: Проверить доступность
      uri:
        url: "http://localhost:{{ http_port }}/"
        status_code: 200
      register: result
      retries: 5
      delay: 3
      until: result.status == 200
      tags: [verify]

# Настройка базы данных
- name: Настройка БД
  hosts: dbservers
  become: yes
  roles:
    - role: mysql
      tags: [db, mysql]

# Настройка балансировщика
- name: Настройка балансировщика
  hosts: loadbalancers
  become: yes
  roles:
    - role: haproxy
      tags: [lb, haproxy]`
      },
      {
        title: "Скрипт деплоя",
        language: "bash",
        code: `#!/bin/bash
# scripts/deploy.sh

set -euo pipefail

ENV=\${1:-staging}
TAGS=\${2:-""}

echo "🚀 Деплой в окружение: $ENV"

# Проверка доступности хостов
echo "📡 Проверка соединения..."
ansible all -i inventory/$ENV/hosts.ini -m ping

# Запуск playbook
if [ -n "$TAGS" ]; then
  echo "🏷️  Теги: $TAGS"
  ansible-playbook site.yml \\
    -i inventory/$ENV/hosts.ini \\
    --vault-password-file ~/.vault_pass \\
    --tags "$TAGS" \\
    --diff
else
  ansible-playbook site.yml \\
    -i inventory/$ENV/hosts.ini \\
    --vault-password-file ~/.vault_pass \\
    --diff
fi

echo "✅ Деплой завершён!"`
      }
    ],
    tips: [
      "Всегда тестируйте playbook с --check --diff перед реальным запуском.",
      "Используйте CI/CD (GitLab CI, GitHub Actions, Jenkins) для автоматизации запусков Ansible.",
      "Ведите логирование всех запусков для аудита и отладки."
    ],
    quiz: {
      question: "Какой флаг ansible.cfg ускоряет выполнение за счёт отключения проверки SSH-ключей?",
      options: [
        "host_key_checking = False",
        "ssh_key_check = disabled",
        "pipelining = True",
        "forks = 10"
      ],
      correct: 0
    }
  }
];
