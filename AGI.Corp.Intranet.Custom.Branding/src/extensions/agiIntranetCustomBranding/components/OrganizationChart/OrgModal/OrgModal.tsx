import * as React from 'react';
import Dialog, { DialogType } from 'office-ui-fabric-react/lib/Dialog';
import { useId, useBoolean } from '@fluentui/react-hooks';
import { IButtonStyles, IconButton } from 'office-ui-fabric-react/lib/Button';
import {
    getTheme,
    mergeStyleSets,
    FontWeights,
    ContextualMenu,
    Toggle,
    Modal,
    IDragOptions,
    IIconProps,
    Stack,
    IStackProps,
} from '@fluentui/react';
import { OrgChart } from '../OrgChart';
import { IOrgModal } from '../../../models/IOrgModal';
import { useEffect, useState } from 'react';
import { sp } from '@pnp/sp';

export const OrgModal = (props: IOrgModal) => {
    const cancelIcon: IIconProps = { iconName: 'Cancel' };
    const theme = getTheme();
    const contentStyles = mergeStyleSets({
        container: {
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'stretch',
            width: 'calc(100% - 500px)'
        },
        header: [
            // eslint-disable-next-line deprecation/deprecation
            theme.fonts.xLargePlus,
            {
                flex: '1 1 auto',
                // borderTop: `4px solid ${theme.palette.themePrimary}`,
                color: theme.palette.neutralPrimary,
                display: 'flex',
                alignItems: 'center',
                fontWeight: FontWeights.semibold,
                padding: '12px 12px 14px 24px',
            },
        ],
        body: {
            flex: '4 4 auto',
            padding: '0 24px 24px 24px',
            overflowY: 'hidden',
            selectors: {
                p: { margin: '14px 0' },
                'p:first-child': { marginTop: 0 },
                'p:last-child': { marginBottom: 0 },
            },
        },
    });
    const iconButtonStyles: Partial<IButtonStyles> = {
        root: {
            color: theme.palette.neutralPrimary,
            marginLeft: 'auto',
            marginTop: '4px',
            marginRight: '2px',
        },
        rootHovered: {
            color: theme.palette.neutralDark,
        },
    };

    const titleId = useId('title');

    const [isModalOpen, { setFalse: hideModal }] = useBoolean(true);
    const [isDraggable] = useBoolean(false);
    const [keepInBounds] = useBoolean(false);
    // Normally the drag options would be in a constant, but here the toggle can modify keepInBounds
    const dragOptions = React.useMemo(
        (): IDragOptions => ({
            moveMenuItemText: 'Move',
            closeMenuItemText: 'Close',
            menu: ContextualMenu,
            keepInBounds,
            dragHandleSelector: '.ms-Modal-scrollableContent > div:first-child',
        }),
        [keepInBounds],
    );

    const [startFromUser, setStartFromUser] = useState(undefined);

    useEffect(() => {
        const getStartFromUser = async () => {
            let user = await sp.web.currentUser();
            setStartFromUser([
                {
                    fullName: user.Title,
                    login: user.LoginName,
                    id: user.LoginName,
                    imageUrl: `https://aginvestment.sharepoint.com/sites/AGIIntranetDev/_layouts/15/userphoto.aspx?size=S&accountname=${user.Email}`
                }
            ])
        }
        getStartFromUser();
    }, []);

    return (<>
        <Modal
            titleAriaId={titleId}
            isOpen={isModalOpen}
            onDismissed={() => props.closeModal()}
            onDismiss={hideModal}
            isBlocking={false}
            containerClassName={contentStyles.container}
            dragOptions={isDraggable ? dragOptions : undefined}
        >
            <div className={contentStyles.header}>
                <span id={titleId}>Organizational Chart</span>
                <IconButton
                    styles={iconButtonStyles}
                    iconProps={cancelIcon}
                    ariaLabel="Close popup modal"
                    onClick={hideModal}
                />
            </div>
            <div className={contentStyles.body}>
                <OrgChart
                    {...props}
                    showActionsBar={false}
                    startFromUser={startFromUser}
                ></OrgChart>
            </div>
        </Modal>
    </>)
}