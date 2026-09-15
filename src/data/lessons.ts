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
  },
  {
    id: 13,
    title: "Работа с Docker",
    icon: "🐳",
    theory: [
      "Ansible отлично интегрируется с Docker для автоматизации работы с контейнерами. Модуль community.docker предоставляет полный набор инструментов для управления контейнерами, образами и сетями.",
      "Основные возможности:",
      "• Управление контейнерами (запуск, остановка, удаление)",
      "• Сборка Docker-образов",
      "• Управление Docker Compose",
      "• Работа с Docker-сетями и volumes",
      "• Управление Docker Registry",
      "Для работы требуется установленный Docker на управляемых машинах и Python-библиотека docker."
    ],
    code: [
      {
        title: "Установка Docker",
        language: "yaml",
        code: `---
- name: Установка Docker
  hosts: all
  become: yes
  tasks:
    - name: Установить зависимости
      apt:
        name:
          - apt-transport-https
          - ca-certificates
          - curl
          - gnupg
          - lsb-release
        state: present

    - name: Добавить GPG-ключ Docker
      apt_key:
        url: https://download.docker.com/linux/ubuntu/gpg
        state: present

    - name: Добавить репозиторий Docker
      apt_repository:
        repo: "deb [arch=amd64] https://download.docker.com/linux/ubuntu {{ ansible_facts['distribution_release'] }} stable"
        state: present

    - name: Установить Docker
      apt:
        name:
          - docker-ce
          - docker-ce-cli
          - containerd.io
          - docker-compose-plugin
        state: present
        update_cache: yes

    - name: Добавить пользователя в группу docker
      user:
        name: "{{ ansible_user }}"
        groups: docker
        append: yes

    - name: Запустить Docker
      service:
        name: docker
        state: started
        enabled: yes`
      },
      {
        title: "Управление контейнерами",
        language: "yaml",
        code: `---
- name: Управление Docker-контейнерами
  hosts: webservers
  become: yes
  tasks:
    - name: Запустить nginx контейнер
      community.docker.docker_container:
        name: my-nginx
        image: nginx:latest
        state: started
        restart_policy: always
        ports:
          - "80:80"
          - "443:443"
        volumes:
          - /data/nginx/html:/usr/share/nginx/html:ro
          - /data/nginx/conf:/etc/nginx/conf.d:ro
        env:
          TZ: "Europe/Moscow"

    - name: Остановить контейнер
      community.docker.docker_container:
        name: old-app
        state: stopped

    - name: Удалить контейнер
      community.docker.docker_container:
        name: old-app
        state: absent
        force_kill: yes

    - name: Перезапустить контейнер
      community.docker.docker_container:
        name: my-nginx
        state: started
        restart: yes`
      },
      {
        title: "Docker Compose",
        language: "yaml",
        code: `---
- name: Развёртывание через Docker Compose
  hosts: webservers
  become: yes
  vars:
    app_dir: /opt/myapp
  tasks:
    - name: Создать директорию приложения
      file:
        path: "{{ app_dir }}"
        state: directory

    - name: Скопировать docker-compose.yml
      template:
        src: docker-compose.yml.j2
        dest: "{{ app_dir }}/docker-compose.yml"

    - name: Запустить compose
      community.docker.docker_compose:
        project_src: "{{ app_dir }}"
        state: present
        pull: yes
        build: yes
      register: output

    - name: Показать результат
      debug:
        var: output

    - name: Остановить compose
      community.docker.docker_compose:
        project_src: "{{ app_dir }}"
        state: absent`
      },
      {
        title: "Сборка образов",
        language: "yaml",
        code: `---
- name: Сборка Docker-образов
  hosts: builders
  tasks:
    - name: Собрать образ
      community.docker.docker_image:
        name: myapp
        tag: latest
        source: build
        build:
          path: /opt/myapp
          dockerfile: Dockerfile
          pull: yes
        state: present

    - name: Отправить в registry
      community.docker.docker_image:
        name: myapp
        tag: latest
        repository: registry.example.com/myapp:latest
        push: yes
        source: local

    - name: Удалить старые образы
      community.docker.docker_prune:
        images: yes
        images_filters:
          dangling: true`
      }
    ],
    tips: [
      "Используйте docker_container с recreate=yes для применения изменений конфигурации.",
      "Для production используйте restart_policy: always или unless-stopped."
    ],
    quiz: {
      question: "Какой параметр docker_container обеспечивает автоматический перезапуск контейнера?",
      options: ["auto_restart: yes", "restart_policy: always", "restart: true", "keep_running: yes"],
      correct: 1
    }
  },
  {
    id: 14,
    title: "Работа с облаками (AWS)",
    icon: "☁️",
    theory: [
      "Ansible предоставляет мощные модули для управления облачной инфраструктурой. Модуль amazon.aws позволяет создавать и управлять ресурсами AWS: EC2, S3, RDS, VPC и другими.",
      "Основные возможности:",
      "• Создание и управление EC2 инстансами",
      "• Управление security groups",
      "• Работа с S3 buckets",
      "• Управление VPC и сетями",
      "• Создание RDS баз данных",
      "• Управление Route53 (DNS)",
      "Для работы требуется настроить AWS credentials через переменные окружения или файл ~/.aws/credentials."
    ],
    code: [
      {
        title: "Создание EC2 инстанса",
        language: "yaml",
        code: `---
- name: Создание EC2 инстанса
  hosts: localhost
  connection: local
  vars:
    region: us-east-1
    instance_type: t3.micro
    ami_id: ami-0c55b159cbfafe1f0
    key_name: my-keypair
    security_group: my-sg

  tasks:
    - name: Создать security group
      amazon.aws.ec2_group:
        name: "{{ security_group }}"
        description: Web server security group
        region: "{{ region }}"
        rules:
          - proto: tcp
            from_port: 22
            to_port: 22
            cidr_ip: 0.0.0.0/0
          - proto: tcp
            from_port: 80
            to_port: 80
            cidr_ip: 0.0.0.0/0
          - proto: tcp
            from_port: 443
            to_port: 443
            cidr_ip: 0.0.0.0/0
        rules_egress:
          - proto: all
            cidr_ip: 0.0.0.0/0
      register: sg_result

    - name: Запустить EC2 инстанс
      amazon.aws.ec2_instance:
        name: web-server-01
        region: "{{ region }}"
        instance_type: "{{ instance_type }}"
        image_id: "{{ ami_id }}"
        key_name: "{{ key_name }}"
        security_group: "{{ sg_result.group_id }}"
        wait: yes
        state: running
        tags:
          Environment: production
          Role: webserver
      register: ec2_result

    - name: Показать IP адрес
      debug:
        msg: "Public IP: {{ ec2_result.instances[0].public_ip_address }}"`
      },
      {
        title: "Работа с S3",
        language: "yaml",
        code: `---
- name: Управление S3
  hosts: localhost
  connection: local
  tasks:
    - name: Создать S3 bucket
      amazon.aws.s3_bucket:
        name: my-app-bucket-12345
        region: us-east-1
        state: present
        versioning: yes
        tags:
          Environment: production

    - name: Загрузить файл в S3
      amazon.aws.s3_object:
        bucket: my-app-bucket-12345
        object: /backups/db-backup.sql.gz
        src: /tmp/db-backup.sql.gz
        mode: put
        permission: private

    - name: Скачать файл из S3
      amazon.aws.s3_object:
        bucket: my-app-bucket-12345
        object: /backups/db-backup.sql.gz
        dest: /tmp/restored-backup.sql.gz
        mode: get

    - name: Создать presigned URL
      amazon.aws.s3_object:
        bucket: my-app-bucket-12345
        object: /public/file.pdf
        mode: geturl
        expiry: 3600
      register: url_result

    - name: Показать URL
      debug:
        var: url_result.presigned_url`
      },
      {
        title: "Динамический инвентарь AWS",
        language: "yaml",
        code: `# aws_ec2.yml - конфигурация динамического инвентаря
---
plugin: amazon.aws.aws_ec2
regions:
  - us-east-1
  - eu-west-1

filters:
  tag:Environment: production
  instance-state-name: running

keyed_groups:
  - key: tags.Role
    prefix: role
  - key: tags.Environment
    prefix: env
  - key: placement.region
    prefix: region

compose:
  ansible_host: public_ip_address

# Использование:
# ansible-inventory -i aws_ec2.yml --graph
# ansible role_webserver -m ping`
      }
    ],
    tips: [
      "Используйте динамический инвентарь для автоматического обнаружения EC2 инстансов.",
      "Храните AWS credentials в Ansible Vault, не в коде."
    ],
    quiz: {
      question: "Какой модуль используется для создания EC2 инстансов?",
      options: ["ec2", "ec2_instance", "aws_instance", "amazon_ec2"],
      correct: 1
    }
  },
  {
    id: 15,
    title: "Kubernetes и Helm",
    icon: "⎈",
    theory: [
      "Ansible может управлять Kubernetes кластерами и развёртывать приложения через Helm charts. Модуль kubernetes.core предоставляет инструменты для работы с K8s ресурсами.",
      "Основные возможности:",
      "• Управление namespaces, deployments, services",
      "• Работа с ConfigMaps и Secrets",
      "• Развёртывание Helm charts",
      "• Управление RBAC",
      "• Мониторинг подов и сервисов",
      "Для работы требуется kubeconfig файл и доступ к Kubernetes API."
    ],
    code: [
      {
        title: "Управление Kubernetes ресурсами",
        language: "yaml",
        code: `---
- name: Управление Kubernetes
  hosts: localhost
  connection: local
  vars:
    kubeconfig: ~/.kube/config
    namespace: production
  tasks:
    - name: Создать namespace
      kubernetes.core.k8s:
        kubeconfig: "{{ kubeconfig }}"
        name: "{{ namespace }}"
        api_version: v1
        kind: Namespace
        state: present

    - name: Создать Deployment
      kubernetes.core.k8s:
        kubeconfig: "{{ kubeconfig }}"
        state: present
        definition:
          apiVersion: apps/v1
          kind: Deployment
          metadata:
            name: myapp
            namespace: "{{ namespace }}"
          spec:
            replicas: 3
            selector:
              matchLabels:
                app: myapp
            template:
              metadata:
                labels:
                  app: myapp
              spec:
                containers:
                  - name: myapp
                    image: myapp:latest
                    ports:
                      - containerPort: 8080
                    resources:
                      requests:
                        memory: "128Mi"
                        cpu: "250m"
                      limits:
                        memory: "256Mi"
                        cpu: "500m"

    - name: Создать Service
      kubernetes.core.k8s:
        kubeconfig: "{{ kubeconfig }}"
        state: present
        definition:
          apiVersion: v1
          kind: Service
          metadata:
            name: myapp-service
            namespace: "{{ namespace }}"
          spec:
            selector:
              app: myapp
            ports:
              - port: 80
                targetPort: 8080
            type: LoadBalancer`
      },
      {
        title: "Развёртывание Helm charts",
        language: "yaml",
        code: `---
- name: Развёртывание через Helm
  hosts: localhost
  connection: local
  vars:
    kubeconfig: ~/.kube/config
    namespace: monitoring
  tasks:
    - name: Добавить Helm репозиторий
      kubernetes.core.helm_repository:
        name: prometheus-community
        repo_url: https://prometheus-community.github.io/helm-charts

    - name: Установить Prometheus stack
      kubernetes.core.helm:
        kubeconfig: "{{ kubeconfig }}"
        name: prometheus
        chart_ref: prometheus-community/kube-prometheus-stack
        release_namespace: "{{ namespace }}"
        create_namespace: yes
        values:
          grafana:
            adminPassword: "{{ grafana_password }}"
          prometheus:
            prometheusSpec:
              retention: 15d
          alertmanager:
            enabled: yes
        wait: yes
        timeout: 600s

    - name: Установить Nginx Ingress Controller
      kubernetes.core.helm:
        kubeconfig: "{{ kubeconfig }}"
        name: ingress-nginx
        chart_ref: ingress-nginx/ingress-nginx
        release_namespace: ingress-nginx
        create_namespace: yes
        values:
          controller:
            replicaCount: 2
            service:
              type: LoadBalancer

    - name: Обновить release
      kubernetes.core.helm:
        kubeconfig: "{{ kubeconfig }}"
        name: prometheus
        chart_ref: prometheus-community/kube-prometheus-stack
        release_namespace: "{{ namespace }}"
        values_files:
          - values/prod-values.yml
        wait: yes`
      },
      {
        title: "Работа с ConfigMaps и Secrets",
        language: "yaml",
        code: `---
- name: Управление конфигурациями K8s
  hosts: localhost
  connection: local
  tasks:
    - name: Создать ConfigMap
      kubernetes.core.k8s:
        state: present
        definition:
          apiVersion: v1
          kind: ConfigMap
          metadata:
            name: app-config
            namespace: production
          data:
            DATABASE_URL: "postgresql://db:5432/myapp"
            CACHE_TTL: "3600"
            LOG_LEVEL: "info"

    - name: Создать Secret
      kubernetes.core.k8s:
        state: present
        definition:
          apiVersion: v1
          kind: Secret
          metadata:
            name: app-secrets
            namespace: production
          type: Opaque
          data:
            DB_PASSWORD: "{{ 'secretpass' | b64encode }}"
            API_KEY: "{{ api_key | b64encode }}"

    - name: Получить информацию о подах
      kubernetes.core.k8s_info:
        kind: Pod
        namespace: production
        label_selectors:
          - app=myapp
      register: pods_info

    - name: Показать статус подов
      debug:
        msg: "Pod {{ item.metadata.name }}: {{ item.status.phase }}"
      loop: "{{ pods_info.resources }}"`
      }
    ],
    tips: [
      "Используйте k8s_info для получения информации о существующих ресурсах.",
      "Helm charts упрощают управление сложными приложениями с множеством зависимостей."
    ],
    quiz: {
      question: "Какой модуль используется для развёртывания Helm charts?",
      options: ["helm_chart", "k8s_helm", "helm", "kubernetes.helm"],
      correct: 2
    }
  },
  {
    id: 16,
    title: "CI/CD интеграция",
    icon: "🔄",
    theory: [
      "Интеграция Ansible с CI/CD системами позволяет автоматизировать развёртывание приложений при каждом изменении кода. Это ключевой элемент DevOps-практик.",
      "Популярные CI/CD системы для Ansible:",
      "• GitLab CI/CD",
      "• GitHub Actions",
      "• Jenkins",
      "• CircleCI",
      "• Azure DevOps",
      "Основные принципы:",
      "• Храните playbook в Git репозитории",
      "• Используйте разные окружения (dev, staging, production)",
      "• Автоматизируйте тестирование playbook (--check)",
      "• Требуйте approval для production развёртывания",
      "• Логируйте все запуски для аудита"
    ],
    code: [
      {
        title: "GitLab CI/CD (.gitlab-ci.yml)",
        language: "yaml",
        code: `---
stages:
  - validate
  - deploy-dev
  - deploy-staging
  - deploy-prod

variables:
  ANSIBLE_HOST_KEY_CHECKING: "False"
  ANSIBLE_FORCE_COLOR: "True"

before_script:
  - pip install ansible
  - ansible-galaxy install -r requirements.yml

validate:
  stage: validate
  script:
    - ansible-playbook site.yml --syntax-check
    - ansible-playbook site.yml --check --diff
  only:
    - merge_requests
    - master

deploy-dev:
  stage: deploy-dev
  script:
    - ansible-playbook site.yml -i inventory/dev/hosts.ini --vault-password-file $VAULT_PASS
  environment:
    name: development
  only:
    - master
  when: manual

deploy-staging:
  stage: deploy-staging
  script:
    - ansible-playbook site.yml -i inventory/staging/hosts.ini --vault-password-file $VAULT_PASS
  environment:
    name: staging
  only:
    - master
  when: manual

deploy-prod:
  stage: deploy-prod
  script:
    - ansible-playbook site.yml -i inventory/prod/hosts.ini --vault-password-file $VAULT_PASS --tags "app,web"
  environment:
    name: production
  only:
    - master
  when: manual
  allow_failure: false`
      },
      {
        title: "GitHub Actions",
        language: "yaml",
        code: `# .github/workflows/deploy.yml
name: Deploy Application

on:
  push:
    branches: [master]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'

      - name: Install Ansible
        run: pip install ansible

      - name: Validate playbook
        run: |
          ansible-playbook site.yml --syntax-check
          ansible-playbook site.yml --check

  deploy:
    needs: validate
    runs-on: ubuntu-latest
    environment: \${{ github.event.inputs.environment || 'staging' }}
    steps:
      - uses: actions/checkout@v3

      - name: Setup SSH
        uses: webfactory/ssh-agent@v0.7.0
        with:
          ssh-private-key: \${{ secrets.SSH_PRIVATE_KEY }}

      - name: Deploy
        env:
          ANSIBLE_VAULT_PASSWORD: \${{ secrets.VAULT_PASSWORD }}
        run: |
          echo "\$ANSIBLE_VAULT_PASSWORD" > .vault_pass
          ansible-playbook site.yml \\
            -i inventory/\${{ github.event.inputs.environment || 'staging' }}/hosts.ini \\
            --vault-password-file .vault_pass
          rm .vault_pass`
      },
      {
        title: "Jenkins Pipeline",
        language: "groovy",
        code: `// Jenkinsfile
pipeline {
    agent any
    
    environment {
        ANSIBLE_HOST_KEY_CHECKING = 'False'
    }
    
    parameters {
        choice(
            name: 'ENVIRONMENT',
            choices: ['dev', 'staging', 'production'],
            description: 'Target environment'
        )
        string(
            name: 'TAGS',
            defaultValue: '',
            description: 'Ansible tags to run (optional)'
        )
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/org/ansible-repo.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'pip install ansible'
                sh 'ansible-galaxy install -r requirements.yml'
            }
        }
        
        stage('Validate') {
            steps {
                sh 'ansible-playbook site.yml --syntax-check'
                sh 'ansible-playbook site.yml --check --diff'
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    def tags = params.TAGS ? "--tags \${params.TAGS}" : ""
                    sh """
                        ansible-playbook site.yml \\
                            -i inventory/\${params.ENVIRONMENT}/hosts.ini \\
                            --vault-password-file ~/.vault_pass \\
                            \${tags}
                    """
                }
            }
        }
    }
    
    post {
        success {
            slackSend(
                color: 'good',
                message: "Deployment to \${params.ENVIRONMENT} succeeded! Job: \${env.JOB_NAME} #\${env.BUILD_NUMBER}"
            )
        }
        failure {
            slackSend(
                color: 'danger',
                message: "Deployment to \${params.ENVIRONMENT} FAILED! Job: \${env.JOB_NAME} #\${env.BUILD_NUMBER}"
            )
        }
    }
}`
      }
    ],
    tips: [
      "Используйте manual triggers для production окружений.",
      "Храните секреты (SSH ключи, vault password) в CI/CD системе, не в коде."
    ],
    quiz: {
      question: "Какой флаг Ansible используется для проверки синтаксиса playbook?",
      options: ["--validate", "--syntax-check", "--check", "--lint"],
      correct: 1
    }
  },
  {
    id: 17,
    title: "Тестирование playbook",
    icon: "🧪",
    theory: [
      "Тестирование Ansible playbook критически важно для обеспечения надёжности и предотвращения ошибок в production. Существует несколько подходов к тестированию.",
      "Уровни тестирования:",
      "1. Синтаксическая проверка (--syntax-check)",
      "2. Dry-run режим (--check --diff)",
      "3. Линтинг (ansible-lint)",
      "4. Модульное тестирование (Molecule)",
      "5. Интеграционное тестирование (Testinfra)",
      "6. Тестирование безопасности (ansible-review)",
      "Molecule — это фреймворк для тестирования Ansible ролей в изолированных окружениях (Docker, Vagrant, облака)."
    ],
    code: [
      {
        title: "Ansible-lint",
        language: "bash",
        code: `# Установка ansible-lint
pip install ansible-lint

# Запуск линтера
ansible-lint site.yml

# Линтинг с конфигурацией
ansible-lint -c .ansible-lint.yml

# Пример .ansible-lint.yml
---
skip_list:
  - yaml[line-length]
  - no-changed-when

warn_list:
  - experimental

use_default_rules: true
verbosity: 1

# Пример вывода:
# WARNING Listing 3 violation(s) that are fatal
# yaml[line-length]: Line too long (165 > 120 characters)
# site.yml:15

# WARNING  Listing 1 violation(s) that are fatal
# no-changed-when: Commands should not change things if nothing needs doing.
# roles/app/tasks/main.yml:23 Task/Handler: Run custom script`
      },
      {
        title: "Molecule тестирование",
        language: "yaml",
        code: `# molecule/default/molecule.yml
---
dependency:
  name: galaxy
  options:
    requirements-file: requirements.yml

driver:
  name: docker

platforms:
  - name: ubuntu-22.04
    image: geerlingguy/docker-ubuntu2204-ansible:latest
    volumes:
      - /sys/fs/cgroup:/sys/fs/cgroup:ro
    privileged: true
    pre_build_image: true
  
  - name: centos-8
    image: geerlingguy/docker-centos8-ansible:latest
    volumes:
      - /sys/fs/cgroup:/sys/fs/cgroup:ro
    privileged: true
    pre_build_image: true

provisioner:
  name: ansible
  playbooks:
    converge: converge.yml
  inventory:
    host_vars:
      ubuntu-22.04:
        ansible_python_interpreter: /usr/bin/python3

verifier:
  name: testinfra

# molecule/default/converge.yml
---
- name: Converge
  hosts: all
  become: true
  roles:
    - role: myrole

# molecule/default/tests/test_default.py
import os
import testinfra.utils.ansible_runner

testinfra_hosts = testinfra.utils.ansible_runner.AnsibleRunner(
    os.environ['MOLECULE_INVENTORY_FILE']
).get_hosts('all')

def test_nginx_installed(host):
    pkg = host.package('nginx')
    assert pkg.is_installed

def test_nginx_running(host):
    service = host.service('nginx')
    assert service.is_running
    assert service.is_enabled

def test_nginx_listening(host):
    socket = host.socket('tcp://0.0.0.0:80')
    assert socket.is_listening`
      },
      {
        title: "Запуск Molecule",
        language: "bash",
        code: `# Установка Molecule
pip install molecule[docker] pytest-testinfra

# Инициализация тестов для роли
cd roles/myrole
molecule init scenario -d docker

# Запуск полного цикла тестирования
molecule test

# Отдельные этапы:
molecule create      # Создать тестовые контейнеры
molecule converge    # Запустить playbook
molecule verify      # Запустить тесты
molecule destroy     # Удалить контейнеры

# Отладка
molecule converge --destroy=never
molecule login -h ubuntu-22.04

# Тестирование на разных платформах
molecule test -s default
molecule test -s centos`
      },
      {
        title: "Testinfra тесты",
        language: "python",
        code: `# tests/test_webserver.py
import pytest

def test_nginx_package(host):
    """Проверка установки nginx"""
    nginx = host.package('nginx')
    assert nginx.is_installed
    assert nginx.version.startswith('1.18')

def test_nginx_service(host):
    """Проверка запуска сервиса"""
    nginx = host.service('nginx')
    assert nginx.is_running
    assert nginx.is_enabled

def test_nginx_config(host):
    """Проверка конфигурации"""
    config = host.file('/etc/nginx/nginx.conf')
    assert config.exists
    assert config.user == 'root'
    assert config.group == 'root'
    assert config.mode == 0o644
    assert config.contains('worker_processes auto')

def test_nginx_port(host):
    """Проверка открытых портов"""
    assert host.socket('tcp://80').is_listening
    assert host.socket('tcp://443').is_listening

def test_app_directory(host):
    """Проверка директории приложения"""
    app_dir = host.file('/var/www/myapp')
    assert app_dir.exists
    assert app_dir.is_directory
    assert app_dir.user == 'www-data'
    assert app_dir.group == 'www-data'

@pytest.mark.parametrize('pkg', [
    'python3',
    'git',
    'curl',
    'wget'
])
def test_required_packages(host, pkg):
    """Проверка необходимых пакетов"""
    assert host.package(pkg).is_installed

def test_firewall_rules(host):
    """Проверка firewall"""
    assert host.iptables.rules() == [
        '-A INPUT -p tcp -m tcp --dport 80 -j ACCEPT',
        '-A INPUT -p tcp -m tcp --dport 443 -j ACCEPT',
        '-A INPUT -p tcp -m tcp --dport 22 -j ACCEPT'
    ]`
      }
    ],
    tips: [
      "Запускайте molecule test перед каждым коммитом в Git.",
      "Используйте разные сценарии Molecule для тестирования на разных ОС."
    ],
    quiz: {
      question: "Какой инструмент используется для тестирования Ansible ролей в изолированных окружениях?",
      options: ["pytest", "ansible-test", "Molecule", "Testinfra"],
      correct: 2
    }
  },
  {
    id: 18,
    title: "Мониторинг и логирование",
    icon: "📊",
    theory: [
      "Мониторинг выполнения Ansible playbook критически важен для отладки, аудита и понимания того, что происходит в infrastructure. Ansible предоставляет несколько механизмов для этого.",
      "Способы мониторинга:",
      "• Callback плагины (stdout, log_plays, mail, slack)",
      "• Ansible Tower / AWX — веб-интерфейс с полным мониторингом",
      "• Интеграция с системами мониторинга (Prometheus, Grafana)",
      "• Логирование в файлы и syslog",
      "• Отправка уведомлений в мессенджеры",
      "Callback плагины позволяют отправлять информацию о выполнении задач в различные системы."
    ],
    code: [
      {
        title: "Настройка callback плагинов",
        language: "ini",
        code: `# ansible.cfg
[defaults]
# Включение callback плагинов
callback_whitelist = profile_tasks, timer, log_plays

# Логирование в файл
log_path = /var/log/ansible.log

# Callback для отправки в syslog
callback_plugins = /usr/share/ansible/plugins/callback

# Пример настройки callback
[callback_log_plays]
log_folder = /var/log/ansible/hosts

# Profile tasks показывает время выполнения каждой задачи
# Timer показывает общее время выполнения playbook

# Альтернативный синтаксис для новых версий
callbacks_enabled = profile_tasks, timer, log_plays, mail`
      },
      {
        title: "Отправка уведомлений",
        language: "yaml",
        code: `---
- name: Развёртывание с уведомлениями
  hosts: webservers
  tasks:
    - name: Развернуть приложение
      # ... задачи развёртывания ...

  post_tasks:
    - name: Уведомление в Slack (успех)
      slack:
        token: "{{ slack_token }}"
        channel: "#deployments"
        msg: "✅ Успешное развёртывание на {{ inventory_hostname }}"
        color: good
      delegate_to: localhost
      when: ansible_play_batch | length > 0
      run_once: yes

    - name: Отправить email
      mail:
        host: smtp.example.com
        port: 587
        username: "{{ smtp_user }}"
        password: "{{ smtp_password }}"
        to:
          - ops@example.com
          - dev@example.com
        subject: "Ansible: Развёртывание завершено"
        body: "Развёртывание на {{ inventory_hostname }} успешно завершено"
        secure: starttls
      delegate_to: localhost
      when: deployment_status == 'success'
      run_once: yes

  handlers:
    - name: Notify on failure
      uri:
        url: "https://hooks.slack.com/services/XXX/YYY/ZZZ"
        method: POST
        body_format: json
        body:
          text: "❌ ОШИБКА: playbook failed on {{ inventory_hostname }}"
          channel: "#alerts"
      delegate_to: localhost
      listen: "Deployment failed"`
      },
      {
        title: "Интеграция с Prometheus",
        language: "yaml",
        code: `---
- name: Развёртывание с метриками
  hosts: all
  tasks:
    - name: Развернуть приложение
      # ... задачи ...
      register: deploy_result

    - name: Отправить метрики в Prometheus Pushgateway
      uri:
        url: "http://pushgateway:9091/metrics/job/ansible/instance/{{ inventory_hostname }}"
        method: POST
        body_format: raw
        body: |
          deployment_success {{ 1 if deploy_result is success else 0 }}
          deployment_duration {{ deploy_result.elapsed | default(0) }}
          deployment_timestamp {{ ansible_date_time.epoch }}
      delegate_to: localhost
      run_once: yes

    - name: Записать метрики локально
      copy:
        content: |
          {
            "host": "{{ inventory_hostname }}",
            "timestamp": "{{ ansible_date_time.iso8601 }}",
            "status": "{{ 'success' if deploy_result is success else 'failed' }}",
            "duration": {{ deploy_result.elapsed | default(0) }},
            "tasks_completed": {{ ansible_play_batch | length }}
          }
        dest: "/var/log/ansible/metrics/{{ inventory_hostname }}.json"
      delegate_to: localhost

# ansible.cfg для prometheus callback
# [defaults]
# callback_whitelist = prometheus
# 
# [callback_prometheus]
# pushgateway_url = http://pushgateway:9091`
      },
      {
        title: "AWX / Ansible Tower",
        language: "yaml",
        code: `# Установка AWX (open-source версия Ansible Tower)
---
- name: Установка AWX
  hosts: awx-server
  become: yes
  tasks:
    - name: Установить Docker
      # ... установка Docker ...

    - name: Установить Docker Compose
      get_url:
        url: https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-linux-x86_64
        dest: /usr/local/bin/docker-compose
        mode: '755'

    - name: Клонировать AWX
      git:
        repo: https://github.com/ansible/awx.git
        dest: /opt/awx
        version: 21.0.0

    - name: Развернуть AWX
      shell: |
        cd /opt/awx/installer
        ansible-playbook -i inventory install.yml
      args:
        chdir: /opt/awx/installer

    - name: Настроить AWX
      uri:
        url: "http://localhost:80/api/v2/config/"
        method: GET
        status_code: 200
      register: awx_status
      until: awx_status.status == 200
      retries: 30
      delay: 10

# После установки AWX предоставляет:
# - Веб-интерфейс для управления
# - REST API
# - Планировщик задач
# - RBAC (Role-Based Access Control)
# - Полное логирование и аудит
# - Интеграция с LDAP/AD`
      }
    ],
    tips: [
      "Используйте callback плагин profile_tasks для анализа производительности playbook.",
      "Настройте уведомления в Slack/Telegram для критичных развёртываний."
    ],
    quiz: {
      question: "Какой callback плагин показывает время выполнения каждой задачи?",
      options: ["timer", "profile_tasks", "log_plays", "debug"],
      correct: 1
    }
  },
  {
    id: 19,
    title: "Безопасность и best practices",
    icon: "🛡️",
    theory: [
      "Безопасность — критический аспект при работе с Ansible, так как он имеет доступ к критической инфраструктуре. Следование best practices помогает защитить систему.",
      "Ключевые принципы безопасности:",
      "• Минимальные привилегии (principle of least privilege)",
      "• Шифрование секретов (Ansible Vault)",
      "• Аудит и логирование всех действий",
      "• Регулярное обновление Ansible и ролей",
      "• Использование SSH ключей вместо паролей",
      "• Ограничение доступа через firewall и security groups",
      "• Проверка playbook перед выполнением (--check)",
      "• Использование отдельных пользователей для Ansible"
    ],
    code: [
      {
        title: "Безопасная конфигурация SSH",
        language: "yaml",
        code: `---
- name: Настройка безопасного SSH
  hosts: all
  become: yes
  tasks:
    - name: Настроить sshd_config
      lineinfile:
        path: /etc/ssh/sshd_config
        regexp: "{{ item.regexp }}"
        line: "{{ item.line }}"
      loop:
        - { regexp: '^#?PasswordAuthentication', line: 'PasswordAuthentication no' }
        - { regexp: '^#?PermitRootLogin', line: 'PermitRootLogin no' }
        - { regexp: '^#?PubkeyAuthentication', line: 'PubkeyAuthentication yes' }
        - { regexp: '^#?MaxAuthTries', line: 'MaxAuthTries 3' }
        - { regexp: '^#?ClientAliveInterval', line: 'ClientAliveInterval 300' }
      notify: Restart sshd

    - name: Создать пользователя для Ansible
      user:
        name: ansible
        shell: /bin/bash
        groups: sudo
        create_home: yes
        state: present

    - name: Настроить sudo для Ansible
      copy:
        content: "ansible ALL=(ALL) NOPASSWD: ALL"
        dest: /etc/sudoers.d/ansible
        mode: '0440'
        validate: 'visudo -cf %s'

    - name: Добавить SSH ключ для Ansible
      authorized_key:
        user: ansible
        state: present
        key: "{{ lookup('file', 'files/ansible_key.pub') }}"

    - name: Ограничить SSH доступ
      ufw:
        rule: limit
        port: ssh
        proto: tcp
        src: "{{ item }}"
      loop:
        - 10.0.0.0/8
        - 192.168.1.0/24

  handlers:
    - name: Restart sshd
      service:
        name: sshd
        state: restarted`
      },
      {
        title: "Best practices для playbook",
        language: "yaml",
        code: `---
# ✅ ХОРОШО: Явные параметры и проверки
- name: Безопасное развёртывание
  hosts: webservers
  become: yes
  become_user: root
  gather_facts: yes
  
  vars:
    # Все переменные явно определены
    app_version: "{{ lookup('env', 'APP_VERSION') | default('latest') }}"
    backup_before_deploy: true
  
  pre_tasks:
    - name: Проверить доступность хостов
      ping:
      
    - name: Создать backup перед развёртыванием
      archive:
        path: /var/www/app
        dest: "/backup/app-{{ ansible_date_time.iso8601_basic_short }}.tar.gz"
      when: backup_before_deploy
  
  tasks:
    - name: Развернуть приложение
      block:
        - name: Скачать новую версию
          get_url:
            url: "https://releases.example.com/app-{{ app_version }}.tar.gz"
            dest: /tmp/app.tar.gz
            checksum: "sha256:{{ app_checksum }}"
          
        - name: Распаковать архив
          unarchive:
            src: /tmp/app.tar.gz
            dest: /var/www/app
            remote_src: yes
          
        - name: Установить зависимости
          pip:
            requirements: /var/www/app/requirements.txt
            virtualenv: /var/www/app/venv
          
      rescue:
        - name: Откатить при ошибке
          debug:
            msg: "Развёртывание не удалось, выполняем откат"
          
        - name: Восстановить из backup
          unarchive:
            src: "{{ backup_file }}"
            dest: /var/www/app
          when: backup_before_deploy
          
      always:
        - name: Очистить временные файлы
          file:
            path: /tmp/app.tar.gz
            state: absent
  
  post_tasks:
    - name: Проверить работоспособность
      uri:
        url: "http://localhost:8080/health"
        status_code: 200
      register: health_check
      retries: 5
      delay: 3
      until: health_check.status == 200`
      },
      {
        title: "Аудит и compliance",
        language: "yaml",
        code: `---
- name: Аудит безопасности
  hosts: all
  become: yes
  tasks:
    - name: Проверить наличие обновлений безопасности
      apt:
        upgrade: dist
        update_cache: yes
      check_mode: yes
      register: updates_available

    - name: Показать доступные обновления
      debug:
        msg: "Доступно обновлений: {{ updates_available.packages | length }}"
      when: updates_available.changed

    - name: Проверить права на критичные файлы
      stat:
        path: "{{ item }}"
      loop:
        - /etc/passwd
        - /etc/shadow
        - /etc/sudoers
      register: file_stats

    - name: Проверить права
      assert:
        that:
          - item.stat.mode == '0644' or item.stat.mode == '0440'
        fail_msg: "Неправильные права на {{ item.item }}: {{ item.stat.mode }}"
      loop: "{{ file_stats.results }}"

    - name: Проверить открытые порты
      shell: ss -tuln | grep LISTEN
      register: open_ports
      changed_when: false

    - name: Показать открытые порты
      debug:
        var: open_ports.stdout_lines

    - name: Проверить запущенные сервисы
      service_facts:
      
    - name: Показать активные сервисы
      debug:
        msg: "{{ ansible_facts.services | dict2items | selectattr('value.state', 'equalto', 'running') | list }}"

    - name: Сгенерировать отчёт аудита
      template:
        src: audit_report.json.j2
        dest: "/var/log/audit/report-{{ ansible_date_time.date }}.json"
      delegate_to: localhost`
      }
    ],
    tips: [
      "Используйте block/rescue/always для обработки ошибок и отката.",
      "Регулярно запускайте аудит безопасности с помощью ansible-lint и специализированных ролей."
    ],
    quiz: {
      question: "Какой блок конструкции используется для обработки ошибок и отката?",
      options: ["try/catch", "block/rescue/always", "error/handle", "on_error"],
      correct: 1
    }
  },
  {
    id: 20,
    title: "Оптимизация производительности",
    icon: "⚡",
    theory: [
      "При работе с большим количеством серверов производительность Ansible становится критичной. Правильная оптимизация может сократить время выполнения playbook в разы.",
      "Основные стратегии оптимизации:",
      "• SSH pipelining — уменьшает количество SSH-сессий",
      "• Fact caching — кэширование фактов между запусками",
      "• Parallel execution — параллельное выполнение (forks)",
      "• Mitogen — альтернативный способ подключения (до 7x быстрее)",
      "• Оптимизация задач — использование when, loop_control",
      "• Стратегии выполнения (strategy)",
      "Fact caching особенно полезен при частых запусках playbook, так как сбор фактов занимает значительное время."
    ],
    code: [
      {
        title: "Оптимизированная конфигурация",
        language: "ini",
        code: `# ansible.cfg - оптимизированная конфигурация
[defaults]
# Параллельное выполнение (по умолчанию 5)
forks = 50

# Кэширование фактов
gathering = smart
fact_caching = jsonfile
fact_caching_connection = /tmp/ansible_facts
fact_caching_timeout = 86400  # 24 часа

# Отключение ненужных проверок
host_key_checking = False
retry_files_enabled = False

# Оптимизация вывода
stdout_callback = yaml
nocows = 1

# Пути к ролям и модулям
roles_path = roles
library = library

[privilege_escalation]
become = True
become_method = sudo
become_user = root

[ssh_connection]
# SSH pipelining - критично для производительности!
pipelining = True

# Оптимизация SSH соединений
ssh_args = -o ControlMaster=auto -o ControlPersist=60s -o PreferredAuthenticities=publickey
control_path_dir = /tmp/ansible-ssh-%%h-%%p-%%r

# Compression для медленных соединений
ssh_extra_args = -o Compression=yes

[connection]
# Таймауты
timeout = 30`
      },
      {
        title: "Fact caching",
        language: "yaml",
        code: `---
- name: Демонстрация fact caching
  hosts: all
  # gathering = smart в ansible.cfg означает:
  # - Собирать факты только если их нет в кэше
  # - Или если они устарели (fact_caching_timeout)
  gather_facts: yes
  
  tasks:
    - name: Использовать кэшированные факты
      debug:
        msg: "OS: {{ ansible_facts['distribution'] }}, IP: {{ ansible_facts['default_ipv4']['address'] }}"

    - name: Пропустить сбор фактов для быстрых задач
      debug:
        msg: "Быстрая задача без фактов"
      # gather_facts: no можно указать для отдельного play

# ansible.cfg для fact caching
# [defaults]
# fact_caching = redis
# fact_caching_connection = localhost:6379:0
# fact_caching_timeout = 3600

# Или с memcached:
# fact_caching = memcached
# fact_caching_connection = localhost:11211`
      },
      {
        title: "Mitogen - ускорение в 7 раз",
        language: "bash",
        code: `# Установка Mitogen
pip install mitogen

# ansible.cfg с Mitogen
[defaults]
strategy_plugins = /path/to/mitogen-0.3.0/ansible_mitogen/plugins/strategy
strategy = mitogen_linear

# Или для mitogen_free (параллельное выполнение)
strategy = mitogen_free

# Преимущества Mitogen:
# - До 7x быстрее для больших инвентарей
# - Меньше накладных расходов на Python
# - Лучшее использование ресурсов

# Ограничения:
# - Не поддерживает Windows
# - Некоторые модули могут не работать
# - Требует Python 2.6+ или 3.5+ на управляемых машинах

# Сравнение производительности:
# Без Mitogen: 100 хостов = 5 минут
# С Mitogen: 100 хостов = 45 секунд`
      },
      {
        title: "Оптимизация задач",
        language: "yaml",
        code: `---
- name: Оптимизированный playbook
  hosts: webservers
  become: yes
  strategy: free  # Параллельное выполнение без ожидания
  
  tasks:
    # ❌ ПЛОХО: Много отдельных задач
    # - apt: name=nginx state=present
    # - apt: name=php state=present
    # - apt: name=mysql state=present
    
    # ✅ ХОРОШО: Одна задача с списком
    - name: Установить пакеты
      apt:
        name:
          - nginx
          - php-fpm
          - mysql-server
          - python3-pip
        state: present
        update_cache: yes
      # Одна SSH сессия вместо четырёх

    # ✅ ХОРОШО: Использовать when для быстрой проверки
    - name: Настроить nginx
      template:
        src: nginx.conf.j2
        dest: /etc/nginx/nginx.conf
      when: nginx_config_changed | default(false)
      notify: Restart nginx

    # ✅ ХОРОШО: Ограничить количество одновременных задач
    - name: Обновить приложения
      command: "/opt/app/update.sh {{ item }}"
      loop: "{{ apps }}"
      loop_control:
        pause: 2  # Пауза между итерациями
      async: 300  # Асинхронное выполнение
      poll: 10    # Проверка каждые 10 секунд
      throttle: 3  # Не более 3 хостов одновременно

    # ✅ ХОРОШО: Использовать register для повторного использования
    - name: Проверить версию приложения
      command: cat /opt/app/version.txt
      register: current_version
      changed_when: false

    - name: Обновить только если нужно
      command: /opt/app/update.sh
      when: current_version.stdout != target_version`
      }
    ],
    tips: [
      "Включите pipelining = True — это самое простое и эффективное улучшение.",
      "Используйте strategy: free для независимых задач на разных хостах."
    ],
    quiz: {
      question: "Какая настройка даёт наибольшее ускорение при работе с большим количеством хостов?",
      options: ["forks = 50", "pipelining = True", "strategy = free", "fact_caching = yes"],
      correct: 1
    }
  }
];
