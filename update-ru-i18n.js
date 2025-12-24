const fs = require('fs');

const data = JSON.parse(fs.readFileSync('src/assets/i18n/ru.json', 'utf8'));

if (!data.maintenance.detail) {
  data.maintenance.detail = {
    add: {
      title: 'Добавить Деталь Техобслуживания',
      form: {
        description: 'Заполните информацию о детали техобслуживания',
        name: 'Название',
        'name.placeholder': 'Введите название детали',
        descriptionLabel: 'Описание',
        'description.placeholder': 'Введите описание детали',
        diagnosis: 'Диагностика',
        'diagnosis.placeholder': 'Введите диагностику проблемы',
        mileage: 'Пробег',
        'mileage.placeholder': 'Введите пробег',
        cost: 'Стоимость',
        'cost.placeholder': 'Введите стоимость',
        technician: 'Техник',
        'technician.placeholder': 'Введите имя техника',
        maintenanceType: 'Тип Техобслуживания',
        'maintenanceType.placeholder': 'Выберите тип техобслуживания',
        nextMaintenanceDate: 'Следующая Дата Техобслуживания',
        'nextMaintenanceDate.placeholder': 'Выберите следующую дату'
      }
    },
    edit: {
      title: 'Редактировать Деталь Техобслуживания',
      form: {
        description: 'Измените информацию о детали техобслуживания',
        name: 'Название',
        'name.placeholder': 'Введите название детали',
        descriptionLabel: 'Описание',
        'description.placeholder': 'Введите описание детали',
        diagnosis: 'Диагностика',
        'diagnosis.placeholder': 'Введите диагностику проблемы',
        mileage: 'Пробег',
        'mileage.placeholder': 'Введите пробег',
        cost: 'Стоимость',
        'cost.placeholder': 'Введите стоимость',
        technician: 'Техник',
        'technician.placeholder': 'Введите имя техника',
        maintenanceType: 'Тип Техобслуживания',
        'maintenanceType.placeholder': 'Выберите тип техобслуживания',
        nextMaintenanceDate: 'Следующая Дата Техобслуживания',
        'nextMaintenanceDate.placeholder': 'Выберите следующую дату'
      }
    },
    list: {
      title: 'Детали Техобслуживания',
      search: {
        placeholder: 'Поиск деталей...'
      },
      empty: {
        title: 'Нет деталей техобслуживания',
        message: 'Детали техобслуживания для данного обслуживания не найдены.',
        action: 'Добавить Деталь'
      },
      cost: 'Стоимость',
      error: 'Ошибка загрузки деталей техобслуживания'
    },
    delete: {
      confirm: {
        title: 'Подтвердить Удаление',
        message: 'Вы уверены, что хотите удалить эту деталь техобслуживания?'
      },
      success: 'Деталь техобслуживания удалена успешно',
      error: 'Ошибка удаления детали техобслуживания'
    }
  };
}

if (!data.maintenance.parts) {
  data.maintenance.parts = {
    title: 'Запчасти',
    empty: 'Запчасти не добавлены',
    add: {
      title: 'Добавить Запчасть',
      form: {
        name: {
          label: 'Название Запчасти',
          placeholder: 'Введите название запчасти'
        },
        quantity: {
          label: 'Количество',
          placeholder: 'Введите количество'
        },
        cost: {
          label: 'Стоимость за Единицу',
          placeholder: 'Введите стоимость за единицу'
        },
        unitOfMeasure: {
          label: 'Единица Измерения',
          placeholder: 'Выберите единицу измерения'
        },
        totalCost: {
          label: 'Общая Стоимость'
        }
      }
    }
  };
}

fs.writeFileSync('src/assets/i18n/ru.json', JSON.stringify(data, null, 2), 'utf8');
console.log('✅ File updated successfully');

